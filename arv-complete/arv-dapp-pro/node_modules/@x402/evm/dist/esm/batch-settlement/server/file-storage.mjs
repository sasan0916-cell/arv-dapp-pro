import {
  isNodeEnoent,
  readJsonFile,
  resolveWithinDir,
  writeJsonAtomic
} from "../../chunk-3632HGL3.mjs";
import {
  normalizeChannelId
} from "../../chunk-5XX3PMSD.mjs";
import "../../chunk-EKCH75YB.mjs";

// src/batch-settlement/server/fileStorage.ts
import { mkdir, open, readdir, readFile, unlink } from "fs/promises";
import { constants } from "fs";
import { dirname, join } from "path";
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
    const dir = join(this.root, "server");
    let names;
    try {
      names = await readdir(dir);
    } catch (err) {
      if (isNodeEnoent(err)) return [];
      throw err;
    }
    const channels = [];
    for (const name of names) {
      if (!name.endsWith(".json")) continue;
      const path = join(dir, name);
      try {
        const raw = await readFile(path, "utf8");
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
    await mkdir(dirname(lockPath), { recursive: true });
    const lockHandle = await this.acquireLock(lockPath);
    try {
      const path = this.filePath(channelId);
      let current;
      try {
        const raw = await readFile(path, "utf8");
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
          await unlink(path);
        } catch (err) {
          if (!isNodeEnoent(err)) throw err;
        }
        return { channel: void 0, status: current ? "deleted" : "unchanged" };
      }
      await writeJsonAtomic(path, next);
      return { channel: next, status: "updated" };
    } finally {
      await lockHandle.close();
      await unlink(lockPath).catch(() => {
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
    return resolveWithinDir(join(this.root, "server"), `${id}.json`);
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
        return await open(lockPath, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY);
      } catch (err) {
        if (err.code !== "EEXIST") {
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
  }
};
export {
  FileChannelStorage
};
//# sourceMappingURL=file-storage.mjs.map