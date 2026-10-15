import { F as FileChannelStorageOptions } from '../../types-B4ib_1f_.mjs';
import { C as ChannelStorage, a as Channel, b as ChannelUpdateResult } from '../../storage-BlE8v9vt.mjs';
import 'viem';

/**
 * Node.js file-backed {@link ChannelStorage} for the batched server scheme.
 */
declare class FileChannelStorage implements ChannelStorage {
    private readonly root;
    /**
     * Creates file-backed server channel storage under the given root directory.
     *
     * @param options - Configuration including the storage root directory.
     */
    constructor(options: FileChannelStorageOptions);
    /**
     * Loads a persisted channel record, if present.
     *
     * @param channelId - The channel identifier (path segment is lowercased).
     * @returns Parsed channel record or `undefined` when the file is missing.
     */
    get(channelId: string): Promise<Channel | undefined>;
    /**
     * Lists all stored channel records by reading the server directory.
     *
     * @returns Channel records sorted by channelId; empty array if the directory is missing.
     */
    list(): Promise<Channel[]>;
    /**
     * Atomically inspects and mutates a channel record under a cross-process file lock.
     *
     * @param channelId - The channel identifier.
     * @param update - Mutation callback. Return `undefined` to delete, or `current` to leave unchanged.
     * @returns The final stored channel and whether storage updated, stayed unchanged, or deleted.
     */
    updateChannel(channelId: string, update: (current: Channel | undefined) => Channel | undefined): Promise<ChannelUpdateResult>;
    /**
     * Absolute path to the JSON file for a channel.
     *
     * @param channelId - The channel identifier.
     * @returns Filesystem path under `{root}/server/...`.
     * @throws When `channelId` is not a canonical `bytes32` string or escapes the storage root.
     */
    private filePath;
    /**
     * Creates an exclusive lock file, polling until no other process holds it.
     *
     * @param lockPath - Absolute path for the lock file (created with `O_EXCL`).
     * @returns Writable file handle for the lock file; caller must close it to release.
     */
    private acquireLock;
}

export { FileChannelStorage, FileChannelStorageOptions };
