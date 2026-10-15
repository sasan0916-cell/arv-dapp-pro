import { SchemeNetworkFacilitator, PaymentPayload, PaymentRequirements, FacilitatorContext, VerifyResponse, SettleResponse, Network } from '@x402/core/types';
import { PendingSettlementStore, x402Facilitator } from '@x402/core/facilitator';
import { F as FacilitatorEvmSigner } from '../../signer-CJuc15ii.mjs';
import 'viem';

interface ExactEvmSchemeConfig {
    /**
     * Allowlist of factory contract addresses (hex strings, case-insensitive) that the facilitator
     * will call when deploying an undeployed smart wallet via ERC-6492.
     *
     * A non-empty list enables ERC-4337 smart wallet deployment via EIP-6492. An empty or omitted
     * list denies all factory deployment calls (feature disabled by default).
     *
     * @default []
     */
    eip6492AllowedFactories?: string[];
    /**
     * If enabled, run on-chain simulation during settle's re-verify.
     *
     * @default false
     */
    simulateInSettle?: boolean;
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
 * EVM facilitator implementation for the Exact payment scheme.
 * Thin router that delegates to EIP-3009 or Permit2 based on payload type.
 * All extension handling (EIP-2612, ERC-20 approval gas sponsoring) is owned
 * by the Permit2 functions via FacilitatorContext.
 */
declare class ExactEvmScheme implements SchemeNetworkFacilitator {
    private readonly signer;
    readonly scheme = "exact";
    readonly caipFamily = "eip155:*";
    private readonly config;
    private readonly pendingStore;
    /**
     * Creates a new ExactEvmScheme facilitator instance.
     *
     * @param signer - The EVM signer for facilitator operations
     * @param config - Optional configuration
     */
    constructor(signer: FacilitatorEvmSigner, config?: ExactEvmSchemeConfig);
    /**
     * Returns undefined — EVM has no mechanism-specific extra data.
     *
     * @param _ - The network identifier (unused)
     * @returns undefined
     */
    getExtra(_: string): Record<string, unknown> | undefined;
    /**
     * Returns facilitator wallet addresses for the supported response.
     *
     * @param _ - The network identifier (unused, addresses are network-agnostic)
     * @returns Array of facilitator wallet addresses
     */
    getSigners(_: string): string[];
    /**
     * Verifies a payment payload. Routes to Permit2 or EIP-3009 based on payload type.
     *
     * @param payload - The payment payload to verify
     * @param requirements - The payment requirements
     * @param context - Optional facilitator context for extension capabilities
     * @param _ - Payment required extensions (unused; reserved for interface parity)
     * @returns Promise resolving to verification response
     */
    verify(payload: PaymentPayload, requirements: PaymentRequirements, context?: FacilitatorContext, _?: Record<string, unknown>): Promise<VerifyResponse>;
    /**
     * Settles a payment. Routes to Permit2 or EIP-3009 based on payload type.
     *
     * @param payload - The payment payload to settle
     * @param requirements - The payment requirements
     * @param context - Optional facilitator context for extension capabilities
     * @returns Promise resolving to settlement response
     */
    settle(payload: PaymentPayload, requirements: PaymentRequirements, context?: FacilitatorContext): Promise<SettleResponse>;
}

/**
 * Configuration options for registering EVM schemes to an x402Facilitator
 */
interface EvmFacilitatorConfig {
    /**
     * The EVM signer for facilitator operations (verify and settle)
     */
    signer: FacilitatorEvmSigner;
    /**
     * Networks to register (single network or array of networks)
     * Examples: "eip155:84532", ["eip155:84532", "eip155:1"]
     */
    networks: Network | Network[];
    /**
     * Allowlist of factory contract addresses (hex strings, case-insensitive) that the facilitator
     * will call when deploying an undeployed smart wallet via ERC-6492.
     *
     * A non-empty list enables ERC-4337 smart wallet deployment via EIP-6492. An empty or omitted
     * list denies all factory deployment calls (feature disabled by default).
     *
     * @default []
     */
    eip6492AllowedFactories?: string[];
    /**
     * If enabled, reruns on-chain simulation during settle's re-verify.
     *
     * @default false
     */
    simulateInSettle?: boolean;
}
/**
 * Registers EVM exact payment schemes to an x402Facilitator instance.
 *
 * This function registers:
 * - V2: Specified networks with ExactEvmScheme
 * - V1: All supported EVM networks with ExactEvmSchemeV1
 *
 * @param facilitator - The x402Facilitator instance to register schemes to
 * @param config - Configuration for EVM facilitator registration
 * @returns The facilitator instance for chaining
 *
 * @example
 * ```typescript
 * import { registerExactEvmScheme } from "@x402/evm/exact/facilitator/register";
 * import { x402Facilitator } from "@x402/core/facilitator";
 * import { createPublicClient, createWalletClient } from "viem";
 *
 * const facilitator = new x402Facilitator();
 *
 * // Single network
 * registerExactEvmScheme(facilitator, {
 *   signer: combinedClient,
 *   networks: "eip155:84532"  // Base Sepolia
 * });
 *
 * // Multiple networks (will auto-derive eip155:* pattern)
 * registerExactEvmScheme(facilitator, {
 *   signer: combinedClient,
 *   networks: ["eip155:84532", "eip155:1"]  // Base Sepolia and Mainnet
 * });
 * ```
 */
declare function registerExactEvmScheme(facilitator: x402Facilitator, config: EvmFacilitatorConfig): x402Facilitator;

export { type EvmFacilitatorConfig, ExactEvmScheme, type ExactEvmSchemeConfig, registerExactEvmScheme };
