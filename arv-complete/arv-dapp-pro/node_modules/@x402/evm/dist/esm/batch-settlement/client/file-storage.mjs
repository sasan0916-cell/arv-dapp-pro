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

// src/batch-settlement/client/fileStorage.ts
import { unlink } from "fs/promises";
import { join } from "path";
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
      await unlink(this.filePath(key));
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
    return resolveWithinDir(join(this.root, "client"), `${id}.json`);
  }
};
export {
  FileClientChannelStorage
};
//# sourceMappingURL=file-storage.mjs.map