import { C as ChannelStorage, a as Channel, b as ChannelUpdateResult } from '../../storage-BlE8v9vt.mjs';
import '../../types-B4ib_1f_.mjs';
import 'viem';

type RedisEvalOptions = {
    keys: string[];
    arguments: string[];
};
type RedisSetOptions = {
    NX?: true;
    PX?: number;
};
type RedisScanOptions = {
    MATCH?: string;
    COUNT?: number;
};
type RedisChannelStorageClient = {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, options?: RedisSetOptions): Promise<string | null>;
    del(key: string): Promise<number>;
    eval(script: string, options: RedisEvalOptions): Promise<unknown>;
    scanIterator(options: RedisScanOptions): AsyncIterable<string | string[]>;
};
type RedisChannelStorageOptions = {
    client: RedisChannelStorageClient;
    keyPrefix?: string;
    lockTtlMs?: number;
    lockRetryIntervalMs?: number;
    lockRenewalIntervalMs?: number;
    scanCount?: number;
};
/**
 * Redis-backed {@link ChannelStorage} with optimistic atomic updates.
 */
declare class RedisChannelStorage implements ChannelStorage {
    private readonly client;
    private readonly keyPrefix;
    private readonly channelKeyPrefix;
    private readonly lockRetryIntervalMs;
    private readonly scanCount;
    /**
     * Creates Redis-backed server channel storage.
     *
     * @param options - Redis client and optional key/retry configuration.
     */
    constructor(options: RedisChannelStorageOptions);
    /**
     * Loads a persisted channel record, if present.
     *
     * @param channelId - The channel identifier.
     * @returns Parsed channel record or `undefined` when the key is missing.
     */
    get(channelId: string): Promise<Channel | undefined>;
    /**
     * Lists all stored channel records by scanning Redis keys.
     *
     * @returns Channel records sorted by channelId.
     */
    list(): Promise<Channel[]>;
    /**
     * Atomically inspects and mutates a channel record with Redis compare-and-write retries.
     *
     * @param channelId - The channel identifier.
     * @param update - Mutation callback. Return `undefined` to delete, or `current` to leave unchanged.
     * @returns The final stored channel and whether storage updated, stayed unchanged, or deleted.
     */
    updateChannel(channelId: string, update: (current: Channel | undefined) => Channel | undefined): Promise<ChannelUpdateResult>;
    /**
     * Applies a channel mutation only if the key still contains the value that was inspected.
     *
     * @param key - Redis channel key to mutate.
     * @param expectedRaw - Raw JSON value observed before running the update callback.
     * @param operation - Mutation to apply when the observed value is still current.
     * @param nextRaw - Raw JSON value to write for set operations.
     * @returns Whether the mutation was applied.
     */
    private commitUpdate;
    /**
     * Builds the Redis key for a stored channel record.
     *
     * @param channelId - The channel identifier.
     * @returns Redis key for the channel JSON.
     */
    private channelKey;
}

export { RedisChannelStorage, type RedisChannelStorageClient, type RedisChannelStorageOptions, type RedisEvalOptions, type RedisScanOptions, type RedisSetOptions };
