import { SchemeNetworkFacilitator, PaymentPayload, PaymentRequirements, FacilitatorContext, VerifyResponse, SettleResponse } from '@x402/core/types';
import { PendingSettlementStore } from '@x402/core/facilitator';
import { F as FacilitatorEvmSigner } from '../../signer-CJuc15ii.js';
import { A as AuthorizerSigner } from '../../types-B4ib_1f_.js';
import 'viem';

interface BatchSettlementEvmSchemeConfig {
    /**
     * Allowlist of factory contract addresses (hex strings, case-insensitive) the facilitator
     * will call to deploy an undeployed (ERC-6492 counterfactual) smart wallet before an
     * ERC-3009 deposit. An empty or omitted list denies all factory deployment (feature
     * disabled by default).
     *
     * @default []
     */
    eip6492AllowedFactories?: string[];
    /**
     * Lets a retried deposit settle for the same authorization reconcile
     * against an already-broadcast transaction instead of re-broadcasting
     * (see {@link PendingSettlementStore}). Only the deposit settle path
     * consults this store; claim/settle/refund are single-signature onchain
     * calls with no equivalent broadcast-then-reconcile flow. Defaults to a
     * fresh in-memory store shared across all deposit settle calls on this
     * scheme instance. Inject a shared, network-backed implementation (e.g.
     * Redis) for a multi-instance facilitator so a settle retry landing on a
     * different replica still reconciles correctly.
     */
    pendingSettlementStore?: PendingSettlementStore;
}
/**
 * Facilitator-side implementation of the `batch-settlement` scheme for EVM networks.
 *
 * Routes incoming verify/settle requests to the appropriate handler based on payload
 * type (deposit, voucher, claim, settle, refund).
 */
declare class BatchSettlementEvmScheme implements SchemeNetworkFacilitator {
    private readonly signer;
    private readonly authorizerSigner?;
    readonly scheme: "batch-settlement";
    readonly caipFamily = "eip155:*";
    private readonly config;
    private readonly pendingStore;
    /**
     * Creates a facilitator scheme for verifying and settling batch-settlement payments.
     *
     * @param signer - Facilitator EVM signer(s) used for tx submission and onchain reads.
     * @param authorizerSigner - Optional dedicated key that provides EIP-712 signatures for
     *   `claimWithSignature` / `refundWithSignature`. When provided, the facilitator advertises
     *   its address as `receiverAuthorizer` in `/supported` and signs missing authorizer
     *   signatures using this key when the server omits them. A facilitator that advertises a
     *   `receiverAuthorizer` for servers to delegate to must authenticate refund requests (see the
     *   spec); when no such mechanism exists, omit this signer so no `receiverAuthorizer` is
     *   advertised and servers supply their own signatures.
     * @param config - Optional configuration (e.g. ERC-6492 factory allowlist).
     */
    constructor(signer: FacilitatorEvmSigner, authorizerSigner?: AuthorizerSigner | undefined, config?: BatchSettlementEvmSchemeConfig);
    /**
     * Returns facilitator-specific extra fields to be merged into payment requirements.
     *
     * Exposes the configured `receiverAuthorizer` address so the server and client can
     * embed it in `ChannelConfig`. Returns `undefined` when no authorizer signer is
     * configured, signalling that servers must supply their own authorizer signatures.
     *
     * @param _ - Network identifier (unused).
     * @returns Extra fields containing `receiverAuthorizer`, or `undefined`.
     */
    getExtra(_: string): {
        receiverAuthorizer: `0x${string}`;
    } | undefined;
    /**
     * Returns all facilitator signer addresses available for the given network.
     *
     * @param _ - Network identifier (unused).
     * @returns Array of hex addresses.
     */
    getSigners(_: string): `0x${string}`[];
    /**
     * Verifies a payment payload (deposit or voucher) without executing settlement.
     *
     * @param payload - The x402 payment payload envelope.
     * @param requirements - Server payment requirements (scheme, network, asset, amount).
     * @param context - Optional facilitator extension context.
     * @param _ - Payment required extensions (unused; reserved for interface parity)
     * @returns A {@link VerifyResponse} indicating validity with payer and channel state in `extra`.
     */
    verify(payload: PaymentPayload, requirements: PaymentRequirements, context?: FacilitatorContext, _?: Record<string, unknown>): Promise<VerifyResponse>;
    /**
     * Executes settlement for a payment payload.
     *
     * Dispatches to the correct handler based on payload settle action:
     * - `deposit` → onchain `deposit(config, amount, collector, collectorData)`
     * - `claim` → onchain `claimWithSignature(VoucherClaim[], bytes)`
     * - `settle` → onchain `settle(receiver, token)`
     * - `refund` → optional claim + onchain `refundWithSignature(config, amount, nonce, sig)`
     *
     * @param payload - The x402 payment payload envelope.
     * @param requirements - Server payment requirements.
     * @param context - Optional facilitator extension context.
     * @returns A {@link SettleResponse} with the transaction hash on success.
     */
    settle(payload: PaymentPayload, requirements: PaymentRequirements, context?: FacilitatorContext): Promise<SettleResponse>;
}

export { BatchSettlementEvmScheme, type BatchSettlementEvmSchemeConfig };
