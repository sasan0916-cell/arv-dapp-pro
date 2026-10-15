import { C as ChannelConfig } from './types-B4ib_1f_.js';

interface Channel {
    channelId: string;
    channelConfig: ChannelConfig;
    chargedCumulativeAmount: string;
    signedMaxClaimable: string;
    signature: string;
    balance: string;
    totalClaimed: string;
    withdrawRequestedAt: number;
    refundNonce: number;
    onchainSyncedAt?: number;
    lastRequestTimestamp: number;
    pendingRequest?: PendingRequest;
}
interface PendingRequest {
    pendingId: string;
    signedMaxClaimable: string;
    expiresAt: number;
}
interface ChannelUpdateResult {
    channel: Channel | undefined;
    status: "updated" | "unchanged" | "deleted";
}
interface ChannelStorage {
    get(channelId: string): Promise<Channel | undefined>;
    list(): Promise<Channel[]>;
    /**
     * Atomically inspects and mutates a channel record.
     *
     * Implementations must guarantee that no concurrent mutation can interleave between
     * reading `current` and writing the callback result for all application instances that
     * share the backend. The in-memory backend only provides this guarantee inside one JS
     * runtime; production multi-instance deployments need storage with backend-level atomic
     * conditional mutation, such as Redis/Valkey Lua scripts, SQL transactions, or Durable Objects.
     *
     * @param channelId - The channel identifier.
     * @param update - Mutation callback. Return `undefined` to delete, or `current` to leave unchanged.
     * @returns The final stored channel and whether storage updated, stayed unchanged, or deleted.
     */
    updateChannel(channelId: string, update: (current: Channel | undefined) => Channel | undefined): Promise<ChannelUpdateResult>;
}
/**
 * In-memory {@link ChannelStorage} backed by a Map keyed by `channelId`.
 */
declare class InMemoryChannelStorage implements ChannelStorage {
    private readonly channels;
    private readonly channelLocks;
    /**
     * Returns the channel record for a channel, if present.
     *
     * @param channelId - The channel identifier.
     * @returns The channel record or undefined when not found.
     */
    get(channelId: string): Promise<Channel | undefined>;
    /**
     * Lists all stored channel records.
     *
     * @returns All channel records in storage.
     */
    list(): Promise<Channel[]>;
    /**
     * Atomically inspects and mutates a channel record while holding a per-channel lock.
     *
     * @param channelId - The channel identifier.
     * @param update - Mutation callback. Return `undefined` to delete, or `current` to leave unchanged.
     * @returns The final stored channel and whether storage updated, stayed unchanged, or deleted.
     */
    updateChannel(channelId: string, update: (current: Channel | undefined) => Channel | undefined): Promise<ChannelUpdateResult>;
    /**
     * Runs `fn` after any prior locked work for the same channel key has finished.
     *
     * @param key - Lowercased channel id used as the lock key.
     * @param fn - Async work to run while holding the logical per-channel lock.
     * @returns The resolved result of `fn`.
     */
    private withChannelLock;
}

export { type ChannelStorage as C, InMemoryChannelStorage as I, type PendingRequest as P, type Channel as a, type ChannelUpdateResult as b };
