import * as _x402_core_types from '@x402/core/types';
import { SchemeNetworkClient, PaymentRequirements, PaymentPayloadContext, PaymentPayloadResult } from '@x402/core/types';
import { C as ClientEvmSigner } from '../../signer-CJuc15ii.mjs';
import { E as ExactDefaultAssetInfo } from '../../defaultAssets-39aDn897.mjs';
import 'viem';

/**
 * Client-side implementation of the auth-capture scheme: derives the canonical
 * payer-agnostic PaymentInfo hash, signs an ERC-3009 ReceiveWithAuthorization
 * (default) or a Permit2 PermitTransferFrom against it, and returns a wire
 * payload the facilitator can settle. Implements `SchemeNetworkClient`.
 */
declare class AuthCaptureEvmScheme implements SchemeNetworkClient {
    private readonly signer;
    readonly scheme: "auth-capture";
    findDefaultAsset: _x402_core_types.FindDefaultAsset<ExactDefaultAssetInfo>;
    /**
     * Construct a client-side auth-capture scheme bound to a specific signer.
     *
     * @param signer - Client-side signer that exposes `address` and `signTypedData`.
     */
    constructor(signer: ClientEvmSigner);
    /**
     * Build and sign an auth-capture payment payload for the given requirements.
     * Validates all spec-mandated `extra` fields and the asset-transfer method
     * (default `eip3009`, alternative `permit2`), reconstructs the on-chain
     * PaymentInfo struct, computes its payer-agnostic hash, and returns the
     * signed wire payload.
     *
     * @param x402Version - Wire protocol version; only `2` is supported.
     * @param requirements - Resource server's payment requirements (includes scheme `extra`).
     * @param _ - Unused FacilitatorContext (interface compatibility).
     * @returns The signed wire payload tagged with the x402 protocol version.
     * @throws If `x402Version !== 2` or any required `extra` field is missing.
     */
    createPaymentPayload(x402Version: number, requirements: PaymentRequirements, _?: PaymentPayloadContext): Promise<PaymentPayloadResult>;
}

export { AuthCaptureEvmScheme };
