import { F as FileChannelStorageOptions } from '../../types-B4ib_1f_.mjs';
import { C as ClientChannelStorage, B as BatchSettlementClientContext } from '../../storage-BFpn16ZW.mjs';
import 'viem';

/**
 * Node.js file-backed {@link ClientChannelStorage} for the batched client scheme.
 * Each channel's context is persisted as `{root}/client/{channelId}.json` so that channel
 * records survive process restarts.
 */
declare class FileClientChannelStorage implements ClientChannelStorage {
    private readonly root;
    /**
     * Creates file-backed client channel storage under the given root directory.
     *
     * @param options - Configuration including the storage root directory.
     */
    constructor(options: FileChannelStorageOptions);
    /**
     * Loads the stored client context for a channel, if present.
     *
     * @param key - Channel storage key (typically a lowercased channelId).
     * @returns Parsed context or `undefined` when the file is missing.
     */
    get(key: string): Promise<BatchSettlementClientContext | undefined>;
    /**
     * Persists the client context for a channel.
     *
     * @param key - Channel storage key.
     * @param context - Context record to write.
     */
    set(key: string, context: BatchSettlementClientContext): Promise<void>;
    /**
     * Removes the persisted context file for a channel, if it exists.
     *
     * @param key - Channel storage key.
     */
    delete(key: string): Promise<void>;
    /**
     * Absolute path to the JSON file for a channel.
     *
     * @param key - Channel storage key (a canonical `bytes32` channel id).
     * @returns Filesystem path under `{root}/client/...`.
     * @throws When `key` is not a canonical `bytes32` string or escapes the storage root.
     */
    private filePath;
}

export { FileChannelStorageOptions, FileClientChannelStorage };
