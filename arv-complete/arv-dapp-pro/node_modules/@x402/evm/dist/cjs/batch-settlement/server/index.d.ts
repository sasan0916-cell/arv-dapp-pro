import { Network, SchemePaymentRequiredContext, SchemeNetworkServer, SchemeServerHooks, PaymentRequirements, DeepReadonly, PaymentPayload, MoneyParser, Price, AssetAmount, SupportedKind } from '@x402/core/types';
import { FacilitatorClient, SettleContext, SettleResultContext } from '@x402/core/server';
import { B as BatchSettlementVoucherClaim, a as BatchSettlementAssetTransferMethod, A as AuthorizerSigner } from '../../types-B4ib_1f_.js';
import { a as Channel, C as ChannelStorage } from '../../storage-BlE8v9vt.js';
export { b as ChannelUpdateResult, I as InMemoryChannelStorage, P as PendingRequest } from '../../storage-BlE8v9vt.js';
import 'viem';

interface ChannelManagerConfig {
    scheme: BatchSettlementEvmScheme;
    facilitator: FacilitatorClient;
    receiver: `0x${string}`;
    token: `0x${string}`;
    network: Network;
}
type ClaimChannelSelector = (channels: Channel[], context: AutoSettlementContext) => Channel[] | Promise<Channel[]>;
interface ClaimOptions {
    maxClaimsPerBatch?: number;
    idleSecs?: number;
    selectClaimChannels?: ClaimChannelSelector;
}
interface AutoSettlementConfig {
    claimIntervalSecs?: number;
    settleIntervalSecs?: number;
    refundIntervalSecs?: number;
    maxClaimsPerBatch?: number;
    selectClaimChannels?: ClaimChannelSelector;
    shouldSettle?: (context: AutoSettlementContext) => boolean | Promise<boolean>;
    selectRefundChannels?: (channels: Channel[], context: AutoSettlementContext) => Channel[] | Promise<Channel[]>;
    onClaim?: (result: ClaimResult) => void;
    onSettle?: (result: SettleResult) => void;
    onRefund?: (result: RefundResult) => void;
    onError?: (error: unknown) => void;
}
interface AutoSettlementContext {
    now: number;
    lastClaimTime: number;
    lastSettleTime: number;
    pendingSettle: boolean;
}
interface ClaimResult {
    vouchers: number;
    transaction: string;
}
interface SettleResult {
    transaction: string;
}
interface RefundResult {
    channel: string;
    transaction: string;
}
/**
 * Manages the server-side channel lifecycle for the `batch-settlement` scheme:
 * batch claiming of vouchers, settlement of claimed funds, and cooperative refund.
 *
 * Provides one-shot operations (`claim()`, `settle()`, `claimAndSettle()`,
 * `refundIdleChannels()`) and an optional interval runner.
 */
declare class BatchSettlementChannelManager {
    private readonly scheme;
    private readonly facilitator;
    private readonly receiver;
    private readonly token;
    private readonly network;
    private timers;
    private lastClaimTime;
    private lastSettleTime;
    private pendingSettle;
    private running;
    private pendingJobs;
    private drainingJobs;
    private autoSettleConfig;
    /**
     * Creates a new channel manager.
     *
     * @param config - Manager configuration: scheme, facilitator, receiver, token, network.
     */
    constructor(config: ChannelManagerConfig);
    /**
     * Collects claimable vouchers and submits them in batches to the facilitator via `claim()`.
     *
     * @param opts - Optional claim execution and target selection options.
     * @param opts.maxClaimsPerBatch - Max vouchers per facilitator `claim` batch.
     * @param opts.idleSecs - When set, only include channels idle for at least this many seconds.
     * @param opts.selectClaimChannels - Optional selector for choosing channels before claimability checks.
     * @returns Array of claim results (one per batch).
     */
    claim(opts?: ClaimOptions): Promise<ClaimResult[]>;
    /**
     * Transfers claimed (but unsettled) funds to the receiver by calling `settle(receiver, token)`.
     *
     * @returns Settle result with the transaction hash.
     */
    settle(): Promise<SettleResult>;
    /**
     * Convenience: claims all eligible vouchers then settles in one call.
     *
     * @param opts - Optional claim execution and target selection options.
     * @param opts.maxClaimsPerBatch - Max vouchers per claim batch before settling.
     * @param opts.idleSecs - When set, only include channels idle for at least this many seconds.
     * @param opts.selectClaimChannels - Optional selector for choosing channels before claimability checks.
     * @returns Combined claim and settle results.
     */
    claimAndSettle(opts?: ClaimOptions): Promise<{
        claims: ClaimResult[];
        settle?: SettleResult;
    }>;
    /**
     * Initiates cooperative refunds for one or more channels.
     *
     * @param channelIds - Specific channels to refund; defaults to all sessions.
     * @returns One result per successfully refunded channel.
     */
    refund(channelIds?: string[]): Promise<RefundResult[]>;
    /**
     * Refunds idle channels with non-zero balances.
     *
     * @param opts - Idle refund options.
     * @param opts.idleSecs - Minimum seconds since the last request.
     * @returns One result per successfully refunded channel.
     */
    refundIdleChannels(opts: {
        idleSecs: number;
    }): Promise<RefundResult[]>;
    /**
     * Collects vouchers that are eligible for onchain claiming.
     *
     * A voucher is claimable when its `chargedCumulativeAmount` exceeds what has already
     * been claimed onchain.  An optional idle filter skips sessions that received a
     * request within the last `idleSecs` seconds.
     *
     * @param opts - Optional filtering: `idleSecs` to only return idle channels.
     * @param opts.idleSecs - Minimum seconds since last request for a channel to be included.
     * @returns Array of {@link BatchSettlementVoucherClaim} entries for batch submission.
     */
    getClaimableVouchers(opts?: {
        idleSecs?: number;
    }): Promise<BatchSettlementVoucherClaim[]>;
    /**
     * Returns channels that have a pending payer-initiated withdrawal.
     *
     * @returns All stored channel records with `withdrawRequestedAt` set.
     */
    getWithdrawalPendingSessions(): Promise<Channel[]>;
    /**
     * Starts auto-settlement jobs for configured claim, settle, and refund intervals.
     *
     * @param config - Auto-settlement policy configuration.
     */
    start(config?: AutoSettlementConfig): void;
    /**
     * Stops the auto-settlement loop.
     *
     * @param opts - Stop options.
     * @param opts.flush - When true, run `claimAndSettle` before stopping.
     * @returns Resolves when the loop is stopped (and flush work completes, if requested).
     */
    stop(opts?: {
        flush?: boolean;
    }): Promise<void>;
    /**
     * Refunds a single channel and removes it from storage after success.
     *
     * @param target - Channel to refund.
     * @returns Successful refund transaction.
     */
    private refundChannel;
    /**
     * Starts a recurring timer for one auto job.
     *
     * @param job - Job to enqueue when the interval fires.
     * @param intervalSecs - Timer interval in seconds.
     */
    private startAutoTimer;
    /**
     * Adds an auto job to the coalescing queue.
     *
     * @param job - Job to run.
     */
    private enqueueJob;
    /**
     * Drains queued auto jobs in priority order.
     */
    private drainJobs;
    /**
     * Returns the highest-priority queued auto job.
     *
     * @returns Next job to run.
     */
    private nextPendingJob;
    /**
     * Runs one auto job.
     *
     * @param job - Job to run.
     */
    private runAutoJob;
    /**
     * Runs the claim auto job.
     */
    private runClaimJob;
    /**
     * Runs the settlement auto job.
     */
    private runSettleJob;
    /**
     * Runs the refund auto job.
     */
    private runRefundJob;
    /**
     * Claims vouchers from a provided channel snapshot.
     *
     * @param channels - Channels to inspect for claimable vouchers.
     * @param opts - Claim batching and filtering options.
     * @param opts.maxClaimsPerBatch - Max vouchers per facilitator claim transaction.
     * @param opts.idleSecs - Optional idle filter.
     * @returns Claim results, one per submitted batch.
     */
    private claimFromChannels;
    /**
     * Loads stored channels and applies the configured claim selector, if any.
     *
     * @param opts - Claim options containing an optional target selector.
     * @returns The channel snapshot that should be inspected for claimable vouchers.
     */
    private selectClaimTargets;
    /**
     * Refunds each eligible channel independently.
     *
     * @param channels - Channels to refund.
     * @returns Successful refund results.
     */
    private refundChannels;
    /**
     * Builds an outstanding voucher claim for a refund payload.
     *
     * @param channel - Channel being refunded.
     * @returns Claim payloads needed before refunding unclaimed balance.
     */
    private buildRefundClaims;
    /**
     * Builds the policy context passed to interval hooks.
     *
     * @param now - Current wall-clock time in milliseconds.
     * @returns Auto-settlement policy context.
     */
    private buildAutoSettlementContext;
    /**
     * Collects claimable vouchers from a provided channel snapshot.
     *
     * @param channels - Channels to inspect.
     * @param opts - Optional idle filter.
     * @param opts.idleSecs - Minimum seconds since last request.
     * @returns Claimable voucher payloads.
     */
    private getClaimableVouchersFromChannels;
    /**
     * Filters idle channels that can be cooperatively refunded.
     *
     * @param channels - Channels to inspect.
     * @param idleSecs - Minimum seconds since the last request.
     * @returns Idle refundable channels.
     */
    private getIdleChannelsForRefundFromChannels;
    /**
     * Returns channels that have been idle longer than `idleSecs` and still have
     * a non-zero balance (candidates for cooperative refund).
     *
     * @param idleSecs - Minimum seconds since last request for a session to count as idle.
     * @returns Channels meeting the idle and balance criteria.
     */
    private getIdleChannelsForRefund;
    /**
     * Submits a batch of voucher claims to the facilitator.
     *
     * @param claims - Voucher claims to send in one `type: "claim"` payload.
     * @returns Per-batch claim summary (count and transaction hash).
     */
    private submitClaim;
    /**
     * Builds a settlement payment payload for `settle(receiver, token)`.
     *
     * @returns Payload with `type: "settle"` and receiver/token fields.
     */
    private buildSettlePaymentPayload;
    /**
     * Builds a minimal {@link PaymentRequirements} for channel manager operations.
     *
     * @returns Requirements describing batched operations for this manager.
     */
    private buildPaymentRequirements;
    /**
     * Updates session records after a successful claim submission so that
     * `getClaimableVouchers` no longer returns already-claimed vouchers.
     *
     * @param claims - Voucher claims that were included in the submitted settlement transaction.
     */
    private updateClaimedSessions;
}

/**
 * Adds server channel state to corrective 402 responses for cumulative mismatches.
 *
 * @param scheme - Owning `BatchSettlementEvmScheme` instance for storage access.
 * @param ctx - Payment-required response context.
 */
declare function handleEnrichPaymentRequiredResponse(scheme: BatchSettlementEvmScheme, ctx: SchemePaymentRequiredContext): Promise<void>;

interface BatchSettlementEvmSchemeServerConfig {
    storage?: ChannelStorage;
    receiverAuthorizerSigner?: AuthorizerSigner;
    withdrawDelay?: number;
    onchainStateTtlMs?: number;
    enforceMinDeposit?: boolean;
}
interface BatchSettlementRequestContext {
    channelId?: string;
    pendingId?: string;
    channelSnapshot?: Channel;
    localVerify?: boolean;
    reservationCommitted?: boolean;
}
/**
 * Server-side implementation of the `batch-settlement` scheme for EVM networks.
 */
declare class BatchSettlementEvmScheme implements SchemeNetworkServer {
    readonly scheme: "batch-settlement";
    readonly defaultAssetTransferMethod: BatchSettlementAssetTransferMethod;
    readonly paymentFlows: {
        readonly eip3009: {
            readonly supported: readonly ["authorization"];
            readonly default: "authorization";
        };
        readonly permit2: {
            readonly supported: readonly ["authorization"];
            readonly default: "authorization";
        };
    };
    readonly schemeHooks: SchemeServerHooks;
    private readonly requestContexts;
    private moneyParsers;
    private readonly storage;
    private readonly receiverAuthorizerSigner;
    private readonly receiverAddress;
    private readonly withdrawDelay;
    private readonly onchainStateTtlMs;
    private readonly enforceMinDeposit;
    /**
     * Constructs a batched server scheme.
     *
     * @param receiverAddress - The server's receiver address (payTo).
     * @param config - Optional configuration for storage, receiver-authorizer signer, and withdraw delay.
     */
    constructor(receiverAddress: `0x${string}`, config?: BatchSettlementEvmSchemeServerConfig);
    /**
     * Adds server-owned settlement fields before facilitator settlement.
     *
     * @param ctx - Settlement context for the current payment.
     * @returns Additive payload fields, or nothing when no enrichment is needed.
     */
    enrichSettlementPayload: (ctx: SettleContext) => Promise<Record<string, unknown> | void>;
    /**
     * Adds corrective channel state to payment-required responses when available.
     *
     * @param ctx - Payment-required response context for the current request.
     * @returns Updated payment requirements, or nothing when no enrichment is needed.
     */
    enrichPaymentRequiredResponse: (ctx: Parameters<typeof handleEnrichPaymentRequiredResponse>[1]) => Promise<PaymentRequirements[] | void>;
    /**
     * Adds server-owned extra fields after facilitator settlement.
     *
     * @param ctx - Settlement result context for the current payment.
     * @returns Additive response extra fields, or nothing when no enrichment is needed.
     */
    enrichSettlementResponse: (ctx: SettleResultContext) => Promise<Record<string, unknown> | void>;
    /**
     * Merges batch-settlement state into the current request context.
     *
     * @param payload - Request-scoped payment payload object.
     * @param context - Partial context fields to merge.
     */
    mergeRequestContext(payload: DeepReadonly<PaymentPayload>, context: BatchSettlementRequestContext): void;
    /**
     * Reads batch-settlement state for the current request without clearing it.
     *
     * @param payload - Request-scoped payment payload object.
     * @returns Request context, if one was recorded.
     */
    readRequestContext(payload: DeepReadonly<PaymentPayload>): BatchSettlementRequestContext | undefined;
    /**
     * Reads and clears batch-settlement state for the current request.
     *
     * @param payload - Request-scoped payment payload object.
     * @returns Request context, if one was recorded.
     */
    takeRequestContext(payload: DeepReadonly<PaymentPayload>): BatchSettlementRequestContext | undefined;
    /**
     * Stores a channel snapshot for the current settlement request.
     *
     * @param payload - Request-scoped payment payload object.
     * @param channel - Channel state to use during response enrichment.
     */
    rememberChannelSnapshot(payload: DeepReadonly<PaymentPayload>, channel: Channel): void;
    /**
     * Reads and clears a channel snapshot for the current settlement request.
     *
     * @param payload - Request-scoped payment payload object.
     * @returns Stored channel state, if one was recorded.
     */
    takeChannelSnapshot(payload: DeepReadonly<PaymentPayload>): Channel | undefined;
    /**
     * Clears this request's pending reservation without touching newer reservations.
     *
     * @param payload - Request-scoped payment payload object.
     */
    clearPendingRequest(payload: DeepReadonly<PaymentPayload>): Promise<void>;
    /**
     * Registers a custom money parser for converting price strings to token amounts.
     *
     * @param parser - A parser function to try before the default USD→token conversion.
     * @returns `this` for chaining.
     */
    registerMoneyParser(parser: MoneyParser): BatchSettlementEvmScheme;
    /**
     * Resolves a human-readable price (e.g. `"$0.01"`) into an onchain token amount.
     *
     * @param price - A price string, number, or explicit {@link AssetAmount}.
     * @param network - CAIP-2 network identifier for looking up the default asset.
     * @returns Token amount with asset address and metadata.
     */
    parsePrice(price: Price, network: Network): Promise<AssetAmount>;
    /**
     * Decimals for a known default asset, or undefined.
     *
     * @param asset - Asset address or symbol
     * @param network - Target network
     * @returns Decimals when the asset is a known default; otherwise undefined
     */
    getAssetDecimals(asset: string, network: Network): number | undefined;
    /**
     * Injects batched-specific fields into the payment requirements returned to
     * the client (receiverAuthorizer, withdrawDelay). Asset metadata (name,
     * version, assetTransferMethod) is left untouched — it is already set by
     * `parsePrice` or supplied explicitly by the caller, and is not re-derived
     * from the default-asset registry here so unlisted networks keep working.
     *
     * @param paymentRequirements - Base payment requirements from the middleware.
     * @param supportedKind - Matched scheme/network kind (extra may contain overrides).
     * @param supportedKind.x402Version - Protocol version from the matched kind.
     * @param supportedKind.scheme - Scheme name from the matched kind.
     * @param supportedKind.network - Network identifier from the matched kind.
     * @param supportedKind.extra - Optional extra fields on the matched kind.
     * @param _extensionKeys - Extension keys (unused).
     * @returns Enhanced payment requirements with batched fields in `extra`.
     */
    enhancePaymentRequirements(paymentRequirements: PaymentRequirements, supportedKind: {
        x402Version: number;
        scheme: string;
        network: Network;
        extra?: Record<string, unknown>;
    }, _extensionKeys: string[]): Promise<PaymentRequirements>;
    /**
     * Fails server startup when this scheme delegates the receiver-authorizer role
     * but the facilitator does not advertise a usable `receiverAuthorizer`.
     *
     * @param network - The network identifier being validated.
     * @param supportedKind - The facilitator's advertised kind for this scheme/network.
     * @param _ - Extensions advertised by the facilitator (unused).
     * @returns A problem message when delegation is impossible, or void when valid.
     */
    validateFacilitatorSupport(network: Network, supportedKind: SupportedKind, _: string[]): string | void;
    /**
     * Returns the underlying channel storage instance.
     *
     * @returns The configured {@link ChannelStorage} backend.
     */
    getStorage(): ChannelStorage;
    /**
     * Returns the server's receiver address.
     *
     * @returns Receiver wallet address for the payment channel.
     */
    getReceiverAddress(): `0x${string}`;
    /**
     * Returns the configured withdraw delay (seconds).
     *
     * @returns Withdraw delay in seconds before uncooperative withdrawal is allowed.
     */
    getWithdrawDelay(): number;
    /**
     * Returns how long mirrored onchain channel state is trusted for local voucher verification.
     *
     * @returns Freshness window in milliseconds.
     */
    getOnchainStateTtlMs(): number;
    /**
     * Returns whether deposits below the announced `extra.minDeposit` hint are rejected.
     *
     * @returns `true` when {@link BatchSettlementEvmSchemeServerConfig.enforceMinDeposit} is enabled.
     */
    getEnforceMinDeposit(): boolean;
    /**
     * Returns the receiver-authorizer signer, if configured.
     *
     * @returns Receiver-authorizer signer, or `undefined` when not set.
     */
    getReceiverAuthorizerSigner(): AuthorizerSigner | undefined;
    /**
     * Creates a {@link BatchSettlementChannelManager} pre-configured with this scheme's
     * receiver, a token for the given network, and the provided facilitator.
     *
     * @param facilitator - Facilitator client for submitting onchain claims/settlements.
     * @param network - CAIP-2 network identifier (e.g. `"eip155:84532"`).
     * @param token - Explicit token address to use. Falls back to the network's
     *   default asset (from the registry) when omitted.
     * @returns A ready-to-use channel manager.
     */
    createChannelManager(facilitator: FacilitatorClient, network: Network, token?: `0x${string}`): BatchSettlementChannelManager;
    /**
     * Resolves the `extra.minDeposit` hint written on every 402.
     *
     * @param paymentRequirements - Base payment requirements for the current request.
     * @returns Atomic minimum deposit hint string.
     */
    resolveMinDepositHint(paymentRequirements: PaymentRequirements): Promise<string>;
    /**
     * Converts a route-level Money `extra.minDeposit` override to atomic units.
     *
     * @param money - Money string from route `accepts.extra.minDeposit`.
     * @param requirement - Payment requirement supplying asset and network.
     * @returns Positive integer atomic min deposit.
     */
    private resolveRouteMoneyMinDeposit;
    /**
     * Validates and normalizes an atomic min deposit amount.
     *
     * @param amount - Integer atomic amount string.
     * @returns Parsed positive bigint.
     */
    private parseAtomicMinDeposit;
    /**
     * Parses a human-readable money string (e.g. `"$1.50"`) into a decimal number.
     *
     * @param money - Money string (may include `$`) or numeric amount.
     * @returns Parsed finite number.
     */
    /**
     * Converts a decimal dollar amount to the network's default token amount.
     *
     * @param amount - Decimal amount in display units.
     * @param network - Target chain/network for default asset resolution.
     * @param symbol - Optional ticker from a suffixed price
     * @returns {@link AssetAmount} with integer token amount, contract address, and metadata.
     */
    private defaultMoneyConversion;
}

declare const ErrDepositBelowMinDeposit = "invalid_batch_settlement_evm_deposit_below_min_deposit";

export { AuthorizerSigner, type AutoSettlementConfig, type AutoSettlementContext, BatchSettlementChannelManager, BatchSettlementEvmScheme, type BatchSettlementEvmSchemeServerConfig, type BatchSettlementRequestContext, Channel, type ChannelManagerConfig, ChannelStorage, type ClaimChannelSelector, type ClaimOptions, type ClaimResult, ErrDepositBelowMinDeposit, type RefundResult, type SettleResult };
