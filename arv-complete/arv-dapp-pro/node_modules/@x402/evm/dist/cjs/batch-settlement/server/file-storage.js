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

// src/batch-settlement/server/fileStorage.ts
var fileStorage_exports = {};
__export(fileStorage_exports, {
  FileChannelStorage: () => FileChannelStorage
});
module.exports = __toCommonJS(fileStorage_exports);
var import_promises2 = require("fs/promises");
var import_node_fs = require("fs");
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

// src/batch-settlement/server/fileStorage.ts
var FileChannelStorage = class {
  /**
   * Creates file-backed server channel storage under the given root directory.
   *
   * @param options - Configuration including the storage root directory.
   */
  constructor(options) {
    this.root = options.directory;
  }
  /**
   * Loads a persisted channel record, if present.
   *
   * @param channelId - The channel identifier (path segment is lowercased).
   * @returns Parsed channel record or `undefined` when the file is missing.
   */
  async get(channelId) {
    return readJsonFile(this.filePath(channelId));
  }
  /**
   * Lists all stored channel records by reading the server directory.
   *
   * @returns Channel records sorted by channelId; empty array if the directory is missing.
   */
  async list() {
    const dir = (0, import_node_path2.join)(this.root, "server");
    let names;
    try {
      names = await (0, import_promises2.readdir)(dir);
    } catch (err) {
      if (isNodeEnoent(err)) return [];
      throw err;
    }
    const channels = [];
    for (const name of names) {
      if (!name.endsWith(".json")) continue;
      const path = (0, import_node_path2.join)(dir, name);
      try {
        const raw = await (0, import_promises2.readFile)(path, "utf8");
        channels.push(JSON.parse(raw));
      } catch (err) {
        if (isNodeEnoent(err)) continue;
        throw err;
      }
    }
    return channels.sort((a, b) => a.channelId.localeCompare(b.channelId));
  }
  /**
   * Atomically inspects and mutates a channel record under a cross-process file lock.
   *
   * @param channelId - The channel identifier.
   * @param update - Mutation callback. Return `undefined` to delete, or `current` to leave unchanged.
   * @returns The final stored channel and whether storage updated, stayed unchanged, or deleted.
   */
  async updateChannel(channelId, update) {
    const lockPath = this.filePath(channelId) + ".lock";
    await (0, import_promises2.mkdir)((0, import_node_path2.dirname)(lockPath), { recursive: true });
    const lockHandle = await this.acquireLock(lockPath);
    try {
      const path = this.filePath(channelId);
      let current;
      try {
        const raw = await (0, import_promises2.readFile)(path, "utf8");
        current = JSON.parse(raw);
      } catch (err) {
        if (!isNodeEnoent(err)) throw err;
      }
      const next = update(current);
      if (next === current) {
        return { channel: current, status: "unchanged" };
      }
      if (!next) {
        try {
          await (0, import_promises2.unlink)(path);
        } catch (err) {
          if (!isNodeEnoent(err)) throw err;
        }
        return { channel: void 0, status: current ? "deleted" : "unchanged" };
      }
      await writeJsonAtomic(path, next);
      return { channel: next, status: "updated" };
    } finally {
      await lockHandle.close();
      await (0, import_promises2.unlink)(lockPath).catch(() => {
      });
    }
  }
  /**
   * Absolute path to the JSON file for a channel.
   *
   * @param channelId - The channel identifier.
   * @returns Filesystem path under `{root}/server/...`.
   * @throws When `channelId` is not a canonical `bytes32` string or escapes the storage root.
   */
  filePath(channelId) {
    const id = normalizeChannelId(channelId);
    return resolveWithinDir((0, import_node_path2.join)(this.root, "server"), `${id}.json`);
  }
  /**
   * Creates an exclusive lock file, polling until no other process holds it.
   *
   * @param lockPath - Absolute path for the lock file (created with `O_EXCL`).
   * @returns Writable file handle for the lock file; caller must close it to release.
   */
  async acquireLock(lockPath) {
    while (true) {
      try {
        return await (0, import_promises2.open)(lockPath, import_node_fs.constants.O_CREAT | import_node_fs.constants.O_EXCL | import_node_fs.constants.O_WRONLY);
      } catch (err) {
        if (err.code !== "EEXIST") {
          throw err;
        }
        await new Promise((resolve2) => setTimeout(resolve2, 10));
      }
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FileChannelStorage
});
//# sourceMappingURL=file-storage.js.map