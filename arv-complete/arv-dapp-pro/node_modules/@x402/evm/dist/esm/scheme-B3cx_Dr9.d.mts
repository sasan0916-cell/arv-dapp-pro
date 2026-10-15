import * as _x402_core_types from '@x402/core/types';
import { PaymentRequirements, SettleResponse, SchemeNetworkClient, SchemeClientHooks, PaymentPayloadContext, PaymentPayloadResult, PaymentRequired } from '@x402/core/types';
import { C as ClientEvmSigner } from './signer-CJuc15ii.mjs';
import { C as ChannelConfig } from './types-B4ib_1f_.mjs';
import { E as EvmSchemeOptions } from './rpc-BBJ9foT3.mjs';
import { B as BatchSettlementClientContext, C as ClientChannelStorage } from './storage-BFpn16ZW.mjs';
import { E as ExactDefaultAssetInfo } from './defaultAssets-39aDn897.mjs';

/**
 * Caller-tunable policy controlling how the client sizes channel deposits.
 */
interface BatchSettlementDepositPolicy {
    depositMultiplier?: number;
}
/**
 * Return shape for custom deposit sizing.
 */
type BatchSettlementDepositStrategyResult = string | bigint | false | undefined;
/**
 * Information supplied before the client signs a deposit authorization.
 */
interface BatchSettlementDepositStrategyContext {
    paymentRequirements: PaymentRequirements;
    channelConfig: ChannelConfig;
    channelId: `0x${string}`;
    clientContext: BatchSettlementClientContext;
    requestAmount: string;
    maxClaimableAmount: string;
    currentBalance: string;
    minimumDepositAmount: string;
    depositAmount: string;
    maxDeposit?: string;
}
/**
 * Custom deposit sizing callback for initial deposits and top-ups.
 */
type BatchSettlementDepositStrategy = (context: BatchSettlementDepositStrategyContext) => BatchSettlementDepositStrategyResult | Promise<BatchSettlementDepositStrategyResult>;
/**
 * Full options object accepted by `BatchSettlementEvmScheme`. Either this or a
 * bare {@link BatchSettlementDepositPolicy} can be passed as the second
 * constructor argument.
 */
interface BatchSettlementEvmSchemeOptions {
    depositPolicy?: BatchSettlementDepositPolicy;
    /** Optional callback for app-specific deposit sizing or skipping. */
    depositStrategy?: BatchSettlementDepositStrategy;
    storage?: ClientChannelStorage;
    salt?: `0x${string}`;
    payerAuthorizer?: `0x${string}`;
    rpcUrl?: string;
    /** When set, EIP-712 vouchers are signed with this key; deposits still use the main `signer`. */
    voucherSigner?: ClientEvmSigner;
}
/**
 * Resolved options after merging defaults — used internally by the scheme,
 * recovery, and refund modules.
 */
interface ResolvedClientOptions {
    depositPolicy?: BatchSettlementDepositPolicy;
    depositStrategy?: BatchSettlementDepositStrategy;
    storage: ClientChannelStorage;
    salt: `0x${string}`;
    payerAuthorizer?: `0x${string}`;
    voucherSigner?: ClientEvmSigner;
    extensionRpcOptions?: EvmSchemeOptions;
}
/**
 * Discriminates a full options object from a bare deposit-policy object.
 *
 * @param o - Constructor argument that may be options, deposit policy only, or undefined.
 * @returns `true` when `o` is a {@link BatchSettlementEvmSchemeOptions} object.
 */
declare function isBatchSettlementEvmSchemeOptions(o: BatchSettlementEvmSchemeOptions | BatchSettlementDepositPolicy | undefined): o is BatchSettlementEvmSchemeOptions;
/**
 * Normalises the constructor's second argument into a uniform options shape.
 *
 * @param second - Optional second constructor argument (options or deposit policy).
 * @returns Resolved storage, salt, deposit policy, and optional payer authorizer.
 */
declare function resolveClientOptions(second?: BatchSettlementEvmSchemeOptions | BatchSettlementDepositPolicy): ResolvedClientOptions;
/**
 * Validates a {@link BatchSettlementDepositPolicy}, throwing on invalid fields.
 *
 * @param policy - The policy to validate (no-op when undefined).
 */
declare function validateDepositPolicy(policy: BatchSettlementDepositPolicy | undefined): void;
/**
 * Parses a server-announced `extra.minDeposit` when it is a valid deposit target.
 *
 * @param value - Wire value from payment requirement `extra`.
 * @param requestAmount - Per-request voucher amount in token base units.
 * @returns Parsed minimum deposit target, or `undefined` when invalid or below `requestAmount`.
 */
declare function parseAnnouncedMinDeposit(value: unknown, requestAmount: bigint): bigint | undefined;
/**
 * Derives the deposit ceiling as `depositMultiplier ×` the resolved spend cap.
 *
 * @param maxAmountPerPayment - Atomic spend cap from payment payload context.
 * @param depositMultiplier - Policy multiplier (default 5).
 * @returns Atomic deposit ceiling, or `undefined` when the payment is uncapped.
 */
declare function maxDepositFromSpendCap(maxAmountPerPayment: unknown, depositMultiplier?: number): bigint | undefined;
/**
 * Clamps a computed deposit to `maxDeposit`. Throws when the voucher gap exceeds the cap.
 *
 * @param deposit - Proposed deposit in token base units.
 * @param needed - Minimum deposit to cover the next voucher.
 * @param maxDeposit - Atomic ceiling (`depositMultiplier ×` spend cap). Omitted when uncapped.
 * @returns Deposit amount string in token base units.
 */
declare function applyMaxDeposit(deposit: bigint, needed: bigint, maxDeposit?: bigint): string;
/**
 * Computes the deposit amount from the voucher gap, server hint, or deposit multiplier.
 *
 * @param policy - Deposit policy controlling multiplier.
 * @param requestAmount - Amount requested for this operation, in token base units.
 * @param needed - Minimum deposit to cover the next voucher (`maxClaimableAmount - balance`).
 * @param extra - Payment requirement `extra` (may contain `minDeposit`).
 * @param maxDeposit - Atomic ceiling (`depositMultiplier ×` spend cap). Omitted when uncapped.
 * @returns Deposit amount string in token base units.
 */
declare function depositAmountForRequest(policy: BatchSettlementDepositPolicy | undefined, requestAmount: bigint, needed: bigint, extra: Record<string, unknown> | undefined, maxDeposit?: bigint): string;

/**
 * Runtime dependency bag shared by every storage-bound client helper (channel,
 * recovery, refund) and the {@link BatchSettlementEvmScheme} class.
 */
interface BatchSettlementClientDeps {
    signer: ClientEvmSigner;
    storage: ClientChannelStorage;
    salt: `0x${string}`;
    payerAuthorizer?: `0x${string}`;
    voucherSigner?: ClientEvmSigner;
}
/**
 * Constructs the immutable {@link ChannelConfig} from payment requirements and
 * a client deps bag (signer, salt, optional payerAuthorizer / voucherSigner).
 *
 * @param deps - Client identity inputs.
 * @param paymentRequirements - Server payment requirements providing receiver, asset, and extra fields.
 * @returns The ChannelConfig that uniquely identifies this payment channel.
 */
declare function buildChannelConfig(deps: BatchSettlementClientDeps, paymentRequirements: PaymentRequirements): ChannelConfig;
/**
 * Local inputs for applying a deposit or voucher settle.
 *
 * `requestAmount` is the per-request maximum (`PaymentRequirements.amount`);
 * the voucher ceiling was `chargedCumulativeAmount + requestAmount`.
 * `depositAmount` is `payload.deposit.amount` for this payment and is added to
 * previous local `balance` after settle. Omit it on voucher-only.
 */
type ChannelSettleLocal = {
    channelId: `0x${string}`;
    requestAmount: string;
    depositAmount?: string;
};
/**
 * Updates local channel state after a deposit or voucher settle.
 *
 * Next cumulative is previous local `chargedCumulativeAmount` plus
 * `server.chargedAmount` (capped at `local.requestAmount`). Next balance is
 * previous local `balance` plus `local.depositAmount` when present;
 * voucher-only leaves balance unchanged. The write is skipped when extra
 * `chargedCumulativeAmount` is present and is not a non-negative integer equal
 * to that next cumulative. Server `channelState` fields are never copied.
 *
 * @param storage - Client channel storage.
 * @param input - Server-reported charge and client-owned settle inputs.
 * @param input.server - Untrusted settlement response fields.
 * @param input.server.chargedAmount - Untrusted `PAYMENT-RESPONSE` extra.chargedAmount.
 * @param input.server.chargedCumulativeAmount - Untrusted extra.channelState.chargedCumulativeAmount.
 * @param input.local - Client-computed channel id, request maximum, and optional deposit.
 */
declare function updateChannelFromSettle(storage: ClientChannelStorage, input: {
    server: {
        chargedAmount?: string;
        chargedCumulativeAmount?: string;
    };
    local: ChannelSettleLocal;
}): Promise<void>;
/**
 * Updates local channel state after a cooperative refund the client signed.
 *
 * Omitted `refundAmount` is a full refund: delete the local record. Otherwise
 * the signed amount is capped to the locally expected refundable balance.
 * Delete the record when that drains the refundable balance; otherwise subtract
 * the effective refund from balance. Cumulative is unchanged, and server
 * `channelState` is not an input.
 *
 * @param storage - Client channel storage.
 * @param channelKey - Lowercased client-computed channel id used as the storage key.
 * @param refundAmount - Partial refund the client signed; omit for a full refund.
 */
declare function updateChannelAfterRefund(storage: ClientChannelStorage, channelKey: string, refundAmount?: string): Promise<void>;
/**
 * Processes the `PAYMENT-RESPONSE` header after a successful request.
 *
 * Decodes the untrusted header and delegates to {@link updateChannelFromSettle}
 * with server `chargedAmount`, optional extra cumulative, and the caller-supplied
 * local channel inputs.
 *
 * @param storage - Client channel storage.
 * @param getHeader - Function to retrieve a response header by name.
 * @param local - Channel id, per-request maximum, and optional deposit from this payment.
 * @param local.channelId - Client-computed channel id used as the storage key.
 * @param local.requestAmount - Per-request maximum (`PaymentRequirements.amount`).
 * @param local.depositAmount - `payload.deposit.amount` from this payment.
 */
declare function processPaymentResponse(storage: ClientChannelStorage, getHeader: (name: string) => string | null | undefined, local: ChannelSettleLocal): Promise<void>;
/**
 * Recovers a channel record from onchain state (useful after a cold start or
 * channel record loss).
 *
 * @param deps - Signer + storage + identity inputs.
 * @param paymentRequirements - Server payment requirements used to derive the ChannelConfig.
 * @returns The recovered client context.
 */
declare function recoverChannel(deps: BatchSettlementClientDeps, paymentRequirements: PaymentRequirements): Promise<BatchSettlementClientContext>;
/**
 * Reads `channels(channelId)` returning `[balance, totalClaimed]`.
 *
 * @param signer - Signer providing `readContract`.
 * @param channelId - The `bytes32` channel id to query.
 * @returns Tuple of `[balance, totalClaimed]` as bigints.
 */
declare function readChannelBalanceAndTotalClaimed(signer: ClientEvmSigner, channelId: `0x${string}`): Promise<[bigint, bigint]>;
/**
 * Returns whether a local channel record exists for the given channel.
 *
 * @param storage - Client channel storage.
 * @param channelId - The channel identifier to check.
 * @returns `true` when a channel record is stored.
 */
declare function hasChannel(storage: ClientChannelStorage, channelId: string): Promise<boolean>;
/**
 * Returns the local channel context for a channel, if present.
 *
 * @param storage - Client channel storage.
 * @param channelId - The channel identifier.
 * @returns Stored context or `undefined`.
 */
declare function getChannel(storage: ClientChannelStorage, channelId: string): Promise<BatchSettlementClientContext | undefined>;

/**
 * Caller-facing options for {@link refundChannel}.
 */
interface RefundOptions {
    /** Token base units to refund; omit for a full refund (drains remaining balance). */
    amount?: string;
    /** Custom fetch implementation (defaults to `globalThis.fetch`). */
    fetch?: typeof fetch;
}
/**
 * Sends a cooperative refund request to the channel that backs `url`.
 *
 * Flow:
 * 1. Probe the URL with `GET` (no payment) to obtain the route's payment requirements.
 * 2. Build the `ChannelConfig` and resolve the local session (or recover it).
 * 3. Sign a zero-charge refund voucher (`maxClaimableAmount = chargedCumulativeAmount`).
 * 4. Send the voucher via `PAYMENT-SIGNATURE`. On a corrective 402, run the
 *    standard recovery path and retry once.
 * 5. Return the parsed `SettleResponse` from the server.
 *
 * @param ctx - Identity inputs (storage, signers, salt, payerAuthorizer).
 * @param url - Any protected route on the channel to refund (the resource handler is bypassed).
 * @param options - Optional `amount` (partial refund) and `fetch` override.
 * @returns The settle response describing the refund outcome.
 * @throws When the probe fails, the receiver lacks an authorizer, or recovery fails.
 */
declare function refundChannel(ctx: BatchSettlementClientDeps, url: string, options?: RefundOptions): Promise<SettleResponse>;

/**
 * Client-side implementation of the `batch-settlement` scheme for EVM networks.
 *
 * Builds payment payloads (deposit + voucher or voucher-only), updates local
 * channel state from payment-response hooks, handles corrective 402
 * resynchronisation via {@link processCorrectivePaymentRequired}, and supports
 * on-demand cooperative refund requests via {@link refundChannel}.
 */
declare class BatchSettlementEvmScheme implements SchemeNetworkClient {
    private readonly signer;
    readonly scheme: "batch-settlement";
    findDefaultAsset: _x402_core_types.FindDefaultAsset<ExactDefaultAssetInfo>;
    readonly schemeHooks: SchemeClientHooks;
    private readonly storage;
    private readonly depositPolicy;
    private readonly depositStrategy;
    private readonly salt;
    private readonly payerAuthorizer;
    private readonly voucherSigner;
    private readonly extensionRpcOptions;
    /**
     * Constructs a batched client scheme.
     *
     * @param signer - Client EVM wallet used for signing vouchers and ERC-3009 authorizations.
     * @param optionsOrPolicy - Either a full options object or a bare deposit-policy.
     */
    constructor(signer: ClientEvmSigner, optionsOrPolicy?: BatchSettlementEvmSchemeOptions | BatchSettlementDepositPolicy);
    /**
     * Creates the payment payload for a batched request.
     *
     * If the channel has no onchain deposit (or needs a top-up), builds an
     * ERC-3009 deposit payload bundled with a voucher. Otherwise, signs and
     * returns a voucher-only payload.
     *
     * @param x402Version - Protocol version for the payload envelope.
     * @param paymentRequirements - Server payment requirements (scheme, network, asset, amount).
     * @param context - Optional extensions and the resolved atomic spend cap.
     * @returns A {@link PaymentPayloadResult} ready to be sent as the `X-PAYMENT` header.
     */
    createPaymentPayload(x402Version: number, paymentRequirements: PaymentRequirements, context?: PaymentPayloadContext): Promise<PaymentPayloadResult>;
    /**
     * Sends a cooperative refund request.
     *
     * @param url - The route URL backing the channel to refund.
     * @param options - Optional `amount` (partial refund) and `fetch` override.
     * @returns The settle response describing the refund outcome.
     */
    refund(url: string, options?: RefundOptions): Promise<SettleResponse>;
    /**
     * Resyncs local channel state from a corrective 402 response.
     *
     * @param paymentRequired - The decoded 402 response body.
     * @returns `true` if local state was successfully resynced and a retry is warranted.
     */
    processCorrectivePaymentRequired(paymentRequired: PaymentRequired): Promise<boolean>;
    /**
     * Builds the immutable {@link ChannelConfig} for a given set of payment
     * requirements, using the scheme's own signer and salt.
     *
     * @param paymentRequirements - Server payment requirements for the channel.
     * @returns The channel config that uniquely identifies the payment channel.
     */
    buildChannelConfig(paymentRequirements: PaymentRequirements): ChannelConfig;
    /**
     * Resolves the deposit amount after applying the optional custom strategy.
     *
     * @param context - Deposit attempt context exposed to the strategy.
     * @returns The deposit amount to sign, or `false` to skip this deposit attempt.
     */
    private resolveDepositAmount;
    /**
     * Normalizes and validates a strategy-provided base-unit deposit amount.
     *
     * @param value - Strategy-provided string or bigint amount.
     * @returns Normalized decimal string.
     */
    private normalizeStrategyDepositAmount;
    /**
     * Signs a voucher-only payment payload for the current channel.
     *
     * @param x402Version - Protocol version for the payload envelope.
     * @param channelId - Channel identifier for the voucher.
     * @param maxClaimableAmount - Cumulative ceiling for the voucher.
     * @param network - CAIP-2 network identifier.
     * @param config - Immutable channel configuration.
     * @returns Voucher-only payment payload.
     */
    private createVoucherPayload;
    /**
     * Bundles the class state into the {@link BatchSettlementClientDeps} shape
     * consumed by the `channel`, `recovery`, and `refund` modules.
     *
     * @returns Client deps wrapping the scheme's own signer and storage.
     */
    private deps;
}

export { type BatchSettlementClientDeps as B, type ChannelSettleLocal as C, type RefundOptions as R, BatchSettlementEvmScheme as a, type BatchSettlementDepositPolicy as b, type BatchSettlementDepositStrategy as c, type BatchSettlementDepositStrategyContext as d, type BatchSettlementDepositStrategyResult as e, type BatchSettlementEvmSchemeOptions as f, applyMaxDeposit as g, depositAmountForRequest as h, isBatchSettlementEvmSchemeOptions as i, resolveClientOptions as j, type ResolvedClientOptions as k, buildChannelConfig as l, maxDepositFromSpendCap as m, getChannel as n, hasChannel as o, parseAnnouncedMinDeposit as p, processPaymentResponse as q, refundChannel as r, readChannelBalanceAndTotalClaimed as s, recoverChannel as t, updateChannelAfterRefund as u, validateDepositPolicy as v, updateChannelFromSettle as w };
