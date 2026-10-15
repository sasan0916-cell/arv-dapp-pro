/**
 * Client-side channel fields mirrored from PAYMENT-RESPONSE / recovery flows.
 */
interface BatchSettlementClientContext {
    /** Current cumulative amount charged by the server for this channel */
    chargedCumulativeAmount?: string;
    /** Current onchain channel balance */
    balance?: string;
    /** Total claimed onchain */
    totalClaimed?: string;
    /** Latest client-signed maxClaimableAmount cap (after corrective recovery, optional) */
    signedMaxClaimable?: string;
    /** Client voucher signature for {@link signedMaxClaimable} (optional) */
    signature?: `0x${string}`;
}
interface ClientChannelStorage {
    get(key: string): Promise<BatchSettlementClientContext | undefined>;
    set(key: string, context: BatchSettlementClientContext): Promise<void>;
    delete(key: string): Promise<void>;
}
/**
 * Default in-memory {@link ClientChannelStorage} (channel records do not survive process restart).
 */
declare class InMemoryClientChannelStorage implements ClientChannelStorage {
    private readonly channels;
    /**
     * Returns the channel record for `key` if present.
     *
     * @param key - Channel storage key (a canonical `bytes32` channel id).
     * @returns Persisted context or undefined.
     */
    get(key: string): Promise<BatchSettlementClientContext | undefined>;
    /**
     * Stores or replaces the channel record for `key`.
     *
     * @param key - Channel storage key (a canonical `bytes32` channel id).
     * @param context - Channel fields to persist.
     * @returns Resolves when stored.
     */
    set(key: string, context: BatchSettlementClientContext): Promise<void>;
    /**
     * Removes the channel record for `key` if it exists.
     *
     * @param key - Channel storage key (a canonical `bytes32` channel id).
     * @returns Resolves when removed.
     */
    delete(key: string): Promise<void>;
}

export { type BatchSettlementClientContext as B, type ClientChannelStorage as C, InMemoryClientChannelStorage as I };
