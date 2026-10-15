import { SchemeNetworkFacilitator, PaymentPayload, PaymentRequirements, FacilitatorContext, VerifyResponse, SettleResponse } from '@x402/core/types';
import { PendingSettlementStore } from '@x402/core/facilitator';
import { F as FacilitatorEvmSigner } from '../../signer-CJuc15ii.mjs';
import 'viem';

/** Optional configuration for {@link UptoEvmScheme}. */
interface UptoEvmSchemeConfig {
    /**
     * Lets a retried settle for the same payload reconcile against an
     * already-broadcast transaction instead of re-verifying and
     * re-broadcasting (see {@link PendingSettlementStore}). Defaults to a
     * fresh in-memory store shared across all settle calls on this scheme
     * instance. Inject a shared, network-backed implementation (e.g. Redis)
     * for a multi-instance facilitator so a settle retry landing on a
     * different replica still reconciles correctly.
     */
    pendingSettlementStore?: PendingSettlementStore;
}
/**
 * EVM facilitator implementation for the Upto payment scheme.
 * Handles verification and settlement of Permit2-based payments.
 */
declare class UptoEvmScheme implements SchemeNetworkFacilitator {
    private readonly signer;
    readonly scheme = "upto";
    readonly caipFamily = "eip155:*";
    private readonly pendingStore;
    /**
     * Creates a new UptoEvmScheme facilitator instance.
     *
     * @param signer - The EVM signer for facilitator operations
     * @param config - Optional configuration
     */
    constructor(signer: FacilitatorEvmSigner, config?: UptoEvmSchemeConfig);
    /**
     * Returns extra metadata required by the upto scheme, including the facilitator address.
     *
     * @param _ - The network identifier (unused)
     * @returns Object with facilitatorAddress, or undefined if no signer addresses are available
     */
    getExtra(_: string): Record<string, unknown> | undefined;
    /**
     * Returns the list of facilitator signer addresses for the upto scheme.
     *
     * @param _ - The network identifier (unused)
     * @returns Array of facilitator signer addresses
     */
    getSigners(_: string): string[];
    /**
     * Verifies an upto Permit2 payment payload against the given requirements.
     *
     * @param payload - The payment payload to verify
     * @param requirements - The payment requirements to verify against
     * @param context - Optional facilitator context
     * @param _ - Payment required extensions (unused; reserved for interface parity)
     * @returns Promise resolving to a verification response
     */
    verify(payload: PaymentPayload, requirements: PaymentRequirements, context?: FacilitatorContext, _?: Record<string, unknown>): Promise<VerifyResponse>;
    /**
     * Settles an upto Permit2 payment on-chain.
     *
     * @param payload - The payment payload to settle
     * @param requirements - The payment requirements
     * @param context - Optional facilitator context
     * @returns Promise resolving to a settlement response
     */
    settle(payload: PaymentPayload, requirements: PaymentRequirements, context?: FacilitatorContext): Promise<SettleResponse>;
}

export { UptoEvmScheme };
