import { P as PaymentPayload, I as PaymentRequirements, V as VerifyResponse, S as SettleResponse, N as Network, J as SchemeNetworkFacilitator, K as FacilitatorExtension } from '../x402Client-C7_OogbK.js';

/**
 * Facilitator Hook Context Interfaces
 */
interface FacilitatorVerifyContext {
    paymentPayload: PaymentPayload;
    requirements: PaymentRequirements;
}
interface FacilitatorVerifyResultContext extends FacilitatorVerifyContext {
    result: VerifyResponse;
}
interface FacilitatorVerifyFailureContext extends FacilitatorVerifyContext {
    error: Error;
}
interface FacilitatorSettleContext {
    paymentPayload: PaymentPayload;
    requirements: PaymentRequirements;
}
interface FacilitatorSettleResultContext extends FacilitatorSettleContext {
    result: SettleResponse;
}
interface FacilitatorSettleFailureContext extends FacilitatorSettleContext {
    error: Error;
}
/**
 * Facilitator Hook Type Definitions
 */
type FacilitatorBeforeVerifyHook = (context: FacilitatorVerifyContext) => Promise<void | {
    abort: true;
    reason: string;
}>;
type FacilitatorAfterVerifyHook = (context: FacilitatorVerifyResultContext) => Promise<void>;
type FacilitatorOnVerifyFailureHook = (context: FacilitatorVerifyFailureContext) => Promise<void | {
    recovered: true;
    result: VerifyResponse;
}>;
type FacilitatorBeforeSettleHook = (context: FacilitatorSettleContext) => Promise<void | {
    abort: true;
    reason: string;
}>;
type FacilitatorAfterSettleHook = (context: FacilitatorSettleResultContext) => Promise<void>;
type FacilitatorOnSettleFailureHook = (context: FacilitatorSettleFailureContext) => Promise<void | {
    recovered: true;
    result: SettleResponse;
}>;
/**
 * Facilitator client for the x402 payment protocol.
 * Manages payment scheme registration, verification, and settlement.
 */
declare class x402Facilitator {
    private readonly registeredFacilitatorSchemes;
    private readonly extensions;
    private beforeVerifyHooks;
    private afterVerifyHooks;
    private onVerifyFailureHooks;
    private beforeSettleHooks;
    private afterSettleHooks;
    private onSettleFailureHooks;
    /**
     * Registers a scheme facilitator for the current x402 version.
     * Networks are stored and used for getSupported() - no need to specify them later.
     *
     * @param networks - Single network or array of networks this facilitator supports
     * @param facilitator - The scheme network facilitator to register
     * @returns The x402Facilitator instance for chaining
     */
    register(networks: Network | Network[], facilitator: SchemeNetworkFacilitator): x402Facilitator;
    /**
     * Registers a scheme facilitator for x402 version 1.
     * Networks are stored and used for getSupported() - no need to specify them later.
     *
     * @param networks - Single network or array of networks this facilitator supports
     * @param facilitator - The scheme network facilitator to register
     * @returns The x402Facilitator instance for chaining
     */
    registerV1(networks: Network | Network[], facilitator: SchemeNetworkFacilitator): x402Facilitator;
    /**
     * Registers a protocol extension.
     *
     * @param extension - The extension object to register
     * @returns The x402Facilitator instance for chaining
     */
    registerExtension(extension: FacilitatorExtension): x402Facilitator;
    /**
     * Gets the list of registered extension keys.
     *
     * @returns Array of extension key strings
     */
    getExtensions(): string[];
    /**
     * Gets a registered extension by key.
     *
     * @param key - The extension key to look up
     * @returns The extension object, or undefined if not registered
     */
    getExtension<T extends FacilitatorExtension = FacilitatorExtension>(key: string): T | undefined;
    /**
     * Register a hook to execute before facilitator payment verification.
     * Can abort verification by returning { abort: true, reason: string }
     *
     * @param hook - The hook function to register
     * @returns The x402Facilitator instance for chaining
     */
    onBeforeVerify(hook: FacilitatorBeforeVerifyHook): x402Facilitator;
    /**
     * Register a hook to execute after successful facilitator payment verification (isValid: true).
     * This hook is NOT called when verification fails (isValid: false) - use onVerifyFailure for that.
     *
     * @param hook - The hook function to register
     * @returns The x402Facilitator instance for chaining
     */
    onAfterVerify(hook: FacilitatorAfterVerifyHook): x402Facilitator;
    /**
     * Register a hook to execute when facilitator payment verification fails.
     * Called when: verification returns isValid: false, or an exception is thrown during verification.
     * Can recover from failure by returning { recovered: true, result: VerifyResponse }
     *
     * @param hook - The hook function to register
     * @returns The x402Facilitator instance for chaining
     */
    onVerifyFailure(hook: FacilitatorOnVerifyFailureHook): x402Facilitator;
    /**
     * Register a hook to execute before facilitator payment settlement.
     * Can abort settlement by returning { abort: true, reason: string }
     *
     * @param hook - The hook function to register
     * @returns The x402Facilitator instance for chaining
     */
    onBeforeSettle(hook: FacilitatorBeforeSettleHook): x402Facilitator;
    /**
     * Register a hook to execute after successful facilitator payment settlement.
     *
     * @param hook - The hook function to register
     * @returns The x402Facilitator instance for chaining
     */
    onAfterSettle(hook: FacilitatorAfterSettleHook): x402Facilitator;
    /**
     * Register a hook to execute when facilitator payment settlement fails.
     * Can recover from failure by returning { recovered: true, result: SettleResponse }
     *
     * @param hook - The hook function to register
     * @returns The x402Facilitator instance for chaining
     */
    onSettleFailure(hook: FacilitatorOnSettleFailureHook): x402Facilitator;
    /**
     * Gets supported payment kinds, extensions, and signers.
     * Uses networks registered during register() calls - no parameters needed.
     * Returns flat array format for backward compatibility with V1 clients.
     *
     * @returns Supported response with kinds as array (with version in each element), extensions, and signers
     */
    getSupported(): {
        kinds: Array<{
            x402Version: number;
            scheme: string;
            network: string;
            extra?: Record<string, unknown>;
        }>;
        extensions: string[];
        signers: Record<string, string[]>;
    };
    /**
     * Verifies a payment payload against requirements.
     *
     * @param paymentPayload - The payment payload to verify
     * @param paymentRequirements - The payment requirements to verify against
     * @returns Promise resolving to the verification response
     */
    verify(paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<VerifyResponse>;
    /**
     * Settles a payment based on the payload and requirements.
     *
     * @param paymentPayload - The payment payload to settle
     * @param paymentRequirements - The payment requirements for settlement
     * @returns Promise resolving to the settlement response
     */
    settle(paymentPayload: PaymentPayload, paymentRequirements: PaymentRequirements): Promise<SettleResponse>;
    /**
     * Builds a FacilitatorContext from the registered extensions map.
     * Passed to mechanism verify/settle so they can access extension capabilities.
     *
     * @returns A FacilitatorContext backed by this facilitator's registered extensions
     */
    private buildFacilitatorContext;
    /**
     * Internal method to register a scheme facilitator.
     *
     * @param x402Version - The x402 protocol version
     * @param networks - Array of concrete networks this facilitator supports
     * @param facilitator - The scheme network facilitator to register
     * @returns The x402Facilitator instance for chaining
     */
    private _registerScheme;
    /**
     * Derives a wildcard pattern from an array of networks.
     * If all networks share the same namespace, returns wildcard pattern.
     * Otherwise returns the first network for exact matching.
     *
     * @param networks - Array of networks
     * @returns Derived pattern for matching
     */
    private derivePattern;
}

/**
 * TTL applied by the default in-memory {@link PendingSettlementStore}
 * implementation. A store implementation backed by a different mechanism
 * (e.g. Redis, for a multi-instance facilitator) is free to use its own TTL —
 * this constant only governs {@link InMemoryPendingSettlementStore}.
 */
declare const PENDING_SETTLEMENT_TTL_MS: number;
/**
 * Lets a facilitator-side mechanism remember a broadcast-but-not-yet-confirmed
 * transaction hash, keyed by a deterministic identifier derived from the
 * payment payload (e.g. an EIP-3009/Permit2 signature, or an SVM message
 * hash/channel id). When a settle attempt's receipt/confirmation wait fails,
 * the mechanism stores the broadcast hash here before returning a
 * `settlement_pending` error. On a subsequent settle attempt for the same
 * payload (typically the resource server's single automatic retry — see
 * `x402ResourceServer.settlePayment`), the mechanism checks this store first
 * and, on a hit, reconciles against the already-broadcast transaction instead
 * of verifying and broadcasting a second one.
 *
 * This is an interface — not a concrete type — specifically so a
 * multi-instance facilitator (running several replicas with no session
 * affinity) can supply a shared, network-backed implementation (e.g. Redis)
 * instead of the in-memory default, which only works when a retry happens to
 * land back on the same process. Implementations must be safe for concurrent
 * use. Mechanism code must depend only on this interface, never on
 * {@link InMemoryPendingSettlementStore} directly.
 */
interface PendingSettlementStore {
    /**
     * Returns the previously stored transaction hash for `key`, if any.
     * Returns `undefined` when there is no entry (including one that has
     * expired).
     *
     * @param key - Deterministic identifier derived from the payment payload
     * @returns The stored transaction hash, or `undefined` when absent
     */
    get(key: string): Promise<string | undefined>;
    /**
     * Records that `key`'s payment broadcast `txHash` but has not yet been
     * confirmed. A subsequent `set` for the same key overwrites the prior
     * value.
     *
     * @param key - Deterministic identifier derived from the payment payload
     * @param txHash - The broadcast transaction hash
     */
    set(key: string, txHash: string): Promise<void>;
    /**
     * Removes any pending entry for `key`, e.g. once the transaction is
     * confirmed (success) or the mechanism determines it terminally failed.
     *
     * @param key - Deterministic identifier derived from the payment payload
     */
    delete(key: string): Promise<void>;
}
/**
 * The default {@link PendingSettlementStore} implementation: a per-process
 * `Map` with lazy TTL pruning (mirrors the shape of
 * `@x402/mechanisms-svm`'s `SettlementCache`). It never performs network
 * I/O — `get` additionally prunes expired entries (O(n) in the number of
 * currently-stored entries, which stays small since entries only exist while
 * a settlement is genuinely pending), so every call adds no meaningful
 * latency to the settle hot path.
 *
 * Node.js is single-threaded, so no lock is required here. Suitable for
 * single-instance facilitators; multi-instance deployments should inject a
 * shared, network-backed {@link PendingSettlementStore} implementation
 * instead (e.g. Redis).
 */
declare class InMemoryPendingSettlementStore implements PendingSettlementStore {
    private readonly entries;
    /**
     * Returns the previously stored transaction hash for `key`, if any.
     *
     * @param key - Deterministic identifier derived from the payment payload
     * @returns The stored transaction hash, or `undefined` when absent/expired
     */
    get(key: string): Promise<string | undefined>;
    /**
     * Records that `key`'s payment broadcast `txHash` but has not yet been
     * confirmed.
     *
     * @param key - Deterministic identifier derived from the payment payload
     * @param txHash - The broadcast transaction hash
     */
    set(key: string, txHash: string): Promise<void>;
    /**
     * Removes any pending entry for `key`.
     *
     * @param key - Deterministic identifier derived from the payment payload
     */
    delete(key: string): Promise<void>;
    /**
     * Returns a snapshot of the underlying map — use only in tests.
     *
     * @returns A plain object mapping each stored key to its transaction hash
     */
    entriesSnapshot(): Record<string, string>;
    /**
     * Removes entries older than {@link PENDING_SETTLEMENT_TTL_MS}.
     */
    private prune;
}

export { type FacilitatorAfterSettleHook, type FacilitatorAfterVerifyHook, type FacilitatorBeforeSettleHook, type FacilitatorBeforeVerifyHook, type FacilitatorOnSettleFailureHook, type FacilitatorOnVerifyFailureHook, type FacilitatorSettleContext, type FacilitatorSettleFailureContext, type FacilitatorSettleResultContext, type FacilitatorVerifyContext, type FacilitatorVerifyFailureContext, type FacilitatorVerifyResultContext, InMemoryPendingSettlementStore, PENDING_SETTLEMENT_TTL_MS, type PendingSettlementStore, x402Facilitator };
