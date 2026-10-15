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

// src/batch-settlement/client/fileStorage.ts
var fileStorage_exports = {};
__export(fileStorage_exports, {
  FileClientChannelStorage: () => FileClientChannelStorage
});
module.exports = __toCommonJS(fileStorage_exports);
var import_promises2 = require("fs/promises");
var import_node_path2 = require("path");

// src/batch-settlement/storage-utils.ts
var import_promises = require("fs/promises");
var import_node_path = require("path");
function resolveWithinDir(baseDir, filename) {
  const base = (0, import_node_path.resolve)(baseDir);
  const target = (0, import_node_path.resolve)(base, filename);
  if (target !== base && !target.startsWith(base + import_node_path.sep)) {
    throw new Error("resolved channel path escapes storage root");
  }
  return target;
}
function isNodeEnoent(err) {
  if (!err || typeof err !== "object" || !("code" in err)) return false;
  return err.code === "ENOENT";
}
async function readJsonFile(filePath) {
  try {
    const raw = await (0, import_promises.readFile)(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (isNodeEnoent(err)) return void 0;
    throw err;
  }
}
async function writeJsonAtomic(filePath, value) {
  const dir = (0, import_node_path.dirname)(filePath);
  await (0, import_promises.mkdir)(dir, { recursive: true });
  const tmp = (0, import_node_path.join)(dir, `.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`);
  const body = `${JSON.stringify(value, null, 2)}
`;
  await (0, import_promises.writeFile)(tmp, body, "utf8");
  try {
    await (0, import_promises.rename)(tmp, filePath);
  } catch {
    await (0, import_promises.unlink)(filePath).catch(() => {
    });
    await (0, import_promises.rename)(tmp, filePath);
  }
}

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

// src/batch-settlement/client/fileStorage.ts
var FileClientChannelStorage = class {
  /**
   * Creates file-backed client channel storage under the given root directory.
   *
   * @param options - Configuration including the storage root directory.
   */
  constructor(options) {
    this.root = options.directory;
  }
  /**
   * Loads the stored client context for a channel, if present.
   *
   * @param key - Channel storage key (typically a lowercased channelId).
   * @returns Parsed context or `undefined` when the file is missing.
   */
  async get(key) {
    return readJsonFile(this.filePath(key));
  }
  /**
   * Persists the client context for a channel.
   *
   * @param key - Channel storage key.
   * @param context - Context record to write.
   */
  async set(key, context) {
    await writeJsonAtomic(this.filePath(key), context);
  }
  /**
   * Removes the persisted context file for a channel, if it exists.
   *
   * @param key - Channel storage key.
   */
  async delete(key) {
    try {
      await (0, import_promises2.unlink)(this.filePath(key));
    } catch (err) {
      if (isNodeEnoent(err)) return;
      throw err;
    }
  }
  /**
   * Absolute path to the JSON file for a channel.
   *
   * @param key - Channel storage key (a canonical `bytes32` channel id).
   * @returns Filesystem path under `{root}/client/...`.
   * @throws When `key` is not a canonical `bytes32` string or escapes the storage root.
   */
  filePath(key) {
    const id = normalizeChannelId(key);
    return resolveWithinDir((0, import_node_path2.join)(this.root, "client"), `${id}.json`);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FileClientChannelStorage
});
//# sourceMappingURL=file-storage.js.map