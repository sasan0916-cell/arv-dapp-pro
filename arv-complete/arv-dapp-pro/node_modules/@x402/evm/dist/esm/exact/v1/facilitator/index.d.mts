import { SchemeNetworkFacilitator, PaymentPayload, PaymentRequirements, VerifyResponse, FacilitatorContext, SettleResponse } from '@x402/core/types';
import { F as FacilitatorEvmSigner } from '../../../signer-CJuc15ii.mjs';
import 'viem';

interface ExactEvmSchemeV1Config {
    /**
     * Allowlist of factory contract addresses (hex strings, case-insensitive) that the facilitator
     * will call when deploying an undeployed smart wallet via ERC-6492.
     *
     * A non-empty list enables ERC-4337 smart wallet deployment via EIP-6492. Facilitators must
     * explicitly list every factory they trust to prevent arbitrary transaction injection via
     * attacker-controlled ERC-6492 signature wrappers. An empty or omitted list denies all factory
     * deployment calls.
     *
     * @default []
     */
    eip6492AllowedFactories?: string[];
    /**
     * If enabled, simulates transaction before settling. Defaults to false, ie only simulate during verify.
     *
     * @default false
     */
    simulateInSettle?: boolean;
}
/**
 * EVM facilitator implementation for the Exact payment scheme (V1).
 */
declare class ExactEvmSchemeV1 implements SchemeNetworkFacilitator {
    private readonly signer;
    readonly scheme = "exact";
    readonly caipFamily = "eip155:*";
    private readonly config;
    /**
     * Creates a new ExactEvmFacilitatorV1 instance.
     *
     * @param signer - The EVM signer for facilitator operations
     * @param config - Optional configuration for the facilitator
     */
    constructor(signer: FacilitatorEvmSigner, config?: ExactEvmSchemeV1Config);
    /**
     * Get mechanism-specific extra data for the supported kinds endpoint.
     * For EVM, no extra data is needed.
     *
     * @param _ - The network identifier (unused for EVM)
     * @returns undefined (EVM has no extra data)
     */
    getExtra(_: string): Record<string, unknown> | undefined;
    /**
     * Get signer addresses used by this facilitator.
     * Returns all addresses this facilitator can use for signing/settling transactions.
     *
     * @param _ - The network identifier (unused for EVM, addresses are network-agnostic)
     * @returns Array of facilitator wallet addresses
     */
    getSigners(_: string): string[];
    /**
     * Verifies a payment payload (V1).
     *
     * @param payload - The payment payload to verify
     * @param requirements - The payment requirements
     * @returns Promise resolving to verification response
     */
    verify(payload: PaymentPayload, requirements: PaymentRequirements): Promise<VerifyResponse>;
    /**
     * Settles a payment by executing the transfer (V1).
     *
     * @param payload - The payment payload to settle
     * @param requirements - The payment requirements
     * @param context - Optional facilitator context for extension capabilities
     * @returns Promise resolving to settlement response
     */
    settle(payload: PaymentPayload, requirements: PaymentRequirements, context?: FacilitatorContext): Promise<SettleResponse>;
    /**
     * Internal verify with optional simulation control.
     *
     * @param payload - The payment payload to verify
     * @param requirements - The payment requirements
     * @param options - Verification options (e.g. simulate)
     * @returns Promise resolving to verification response
     */
    private _verify;
}

export { ExactEvmSchemeV1, type ExactEvmSchemeV1Config };
