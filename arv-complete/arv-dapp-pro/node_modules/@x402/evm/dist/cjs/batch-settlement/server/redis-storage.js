"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/batch-settlement/server/redisStorage.ts
var redisStorage_exports = {};
__export(redisStorage_exports, {
  RedisChannelStorage: () => RedisChannelStorage
});
module.exports = __toCommonJS(redisStorage_exports);

// src/batch-settlement/utils.ts
var import_viem3 = require("viem");

// src/batch-settlement/constants.ts
var import_viem = require("viem");
var CHANNEL_CONFIG_TYPEHASH = (0, import_viem.keccak256)(
  (0, import_viem.toBytes)(
    "ChannelConfig(address payer,address payerAuthorizer,address receiver,address receiverAuthorizer,address token,uint40 withdrawDelay,bytes32 salt)"
  )
);

// src/batch-settlement/errors.ts
var ErrInvalidChannelId = "invalid_batch_settlement_evm_channel_id_invalid";

// src/utils.ts
var import_viem2 = require("viem");

// src/batch-settlement/utils.ts
var CHANNEL_ID_RE = /^0x[0-9a-fA-F]{64}$/;
function isCanonicalChannelId(value) {
  return typeof value === "string" && CHANNEL_ID_RE.test(value);
}
function normalizeChannelId(channelId) {
  if (!isCanonicalChannelId(channelId)) {
    throw new Error(ErrInvalidChannelId);
  }
  return channelId.toLowerCase();
}

// src/batch-settlement/server/redisStorage.ts
var DEFAULT_KEY_PREFIX = "x402:batch-settlement";
var DEFAULT_LOCK_RETRY_INTERVAL_MS = 10;
var DEFAULT_SCAN_COUNT = 100;
var UPDATE_CHANNEL_SCRIPT = `
local current = redis.call("GET", KEYS[1])
local expectedExists = ARGV[1]
local expected = ARGV[2]
local operation = ARGV[3]
local nextValue = ARGV[4]

if expectedExists == "0" then
  if current ~= false then
    return {0, current}
  end
elseif current ~= expected then
  return {0, current or false}
end

if operation == "delete" then
  redis.call("DEL", KEYS[1])
  return {1, false}
end

if operation == "set" then
  redis.call("SET", KEYS[1], nextValue)
  return {1, nextValue}
end

return {1, current or false}
`;
var RedisChannelStorage = class {
  /**
   * Creates Redis-backed server channel storage.
   *
   * @param options - Redis client and optional key/retry configuration.
   */
  constructor(options) {
    this.client = options.client;
    this.keyPrefix = options.keyPrefix ?? DEFAULT_KEY_PREFIX;
    this.channelKeyPrefix = `${this.keyPrefix}:server:channel`;
    this.lockRetryIntervalMs = options.lockRetryIntervalMs ?? DEFAULT_LOCK_RETRY_INTERVAL_MS;
    this.scanCount = options.scanCount ?? DEFAULT_SCAN_COUNT;
  }
  /**
   * Loads a persisted channel record, if present.
   *
   * @param channelId - The channel identifier.
   * @returns Parsed channel record or `undefined` when the key is missing.
   */
  async get(channelId) {
    const raw = await this.client.get(this.channelKey(channelId));
    if (!raw) return void 0;
    return JSON.parse(raw);
  }
  /**
   * Lists all stored channel records by scanning Redis keys.
   *
   * @returns Channel records sorted by channelId.
   */
  async list() {
    const channels = [];
    for await (const keyOrKeys of this.client.scanIterator({
      MATCH: `${this.channelKeyPrefix}:*`,
      COUNT: this.scanCount
    })) {
      const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
      for (const key of keys) {
        if (key.endsWith(":lock")) continue;
        const raw = await this.client.get(key);
        if (!raw) continue;
        channels.push(JSON.parse(raw));
      }
    }
    return channels.sort((a, b) => a.channelId.localeCompare(b.channelId));
  }
  /**
   * Atomically inspects and mutates a channel record with Redis compare-and-write retries.
   *
   * @param channelId - The channel identifier.
   * @param update - Mutation callback. Return `undefined` to delete, or `current` to leave unchanged.
   * @returns The final stored channel and whether storage updated, stayed unchanged, or deleted.
   */
  async updateChannel(channelId, update) {
    const key = this.channelKey(channelId);
    while (true) {
      const currentRaw = await this.client.get(key);
      const current = currentRaw ? JSON.parse(currentRaw) : void 0;
      const next = update(current);
      if (next === current) {
        const result2 = await this.commitUpdate(key, currentRaw, "keep");
        if (result2.applied) return { channel: current, status: "unchanged" };
        await sleep(this.lockRetryIntervalMs);
        continue;
      }
      if (!next) {
        const result2 = await this.commitUpdate(key, currentRaw, "delete");
        if (result2.applied) {
          return { channel: void 0, status: current ? "deleted" : "unchanged" };
        }
        await sleep(this.lockRetryIntervalMs);
        continue;
      }
      const nextRaw = JSON.stringify(next);
      const result = await this.commitUpdate(key, currentRaw, "set", nextRaw);
      if (result.applied) return { channel: next, status: "updated" };
      await sleep(this.lockRetryIntervalMs);
    }
  }
  /**
   * Applies a channel mutation only if the key still contains the value that was inspected.
   *
   * @param key - Redis channel key to mutate.
   * @param expectedRaw - Raw JSON value observed before running the update callback.
   * @param operation - Mutation to apply when the observed value is still current.
   * @param nextRaw - Raw JSON value to write for set operations.
   * @returns Whether the mutation was applied.
   */
  async commitUpdate(key, expectedRaw, operation, nextRaw = "") {
    return parseRedisUpdateResult(
      await this.client.eval(UPDATE_CHANNEL_SCRIPT, {
        keys: [key],
        arguments: [expectedRaw === null ? "0" : "1", expectedRaw ?? "", operation, nextRaw]
      })
    );
  }
  /**
   * Builds the Redis key for a stored channel record.
   *
   * @param channelId - The channel identifier.
   * @returns Redis key for the channel JSON.
   */
  channelKey(channelId) {
    return `${this.channelKeyPrefix}:${normalizeChannelId(channelId)}`;
  }
};
function parseRedisUpdateResult(value) {
  if (!Array.isArray(value) || value.length < 1) {
    throw new Error("Unexpected Redis update response");
  }
  const [applied, raw] = value;
  if (applied !== 0 && applied !== 1) {
    throw new Error("Unexpected Redis update status");
  }
  if (raw !== false && raw !== null && raw !== void 0 && typeof raw !== "string") {
    throw new Error("Unexpected Redis update value");
  }
  return { applied: applied === 1 };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RedisChannelStorage
});
//# sourceMappingURL=redis-storage.js.map