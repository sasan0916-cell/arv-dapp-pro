import { DefaultAsset, GetDefaultAsset, FindDefaultAsset, DefaultAssetTable } from '@x402/core/types';

/**
 * Base stablecoin asset configuration shared across all EVM payment schemes.
 * Contains the core fields needed to identify and convert tokens.
 */
type DefaultAssetInfo = DefaultAsset & {
    /** EIP-712 domain name (must match the token's domain separator) */
    name: string;
    /** EIP-712 domain version (must match the token's domain separator) */
    version: string;
};
/**
 * Extended asset configuration for the exact scheme.
 * Includes transfer method hints that control client-side behaviour.
 */
type ExactDefaultAssetInfo = DefaultAssetInfo & {
    /**
     * Transfer method override: `"permit2"` for tokens that don't support EIP-3009.
     * Omit for EIP-3009 tokens (default behaviour).
     */
    assetTransferMethod?: string;
    /**
     * Set to `true` for permit2 tokens that implement EIP-2612 `permit()`.
     * Controls whether name/version are included in `extra` so the client can
     * sign a gasless EIP-2612 permit for Permit2 approval.
     */
    supportsEip2612?: boolean;
};
/** Default USD-pegged assets by CAIP-2 network; index 0 is the `"$0.10"` default. */
declare const DEFAULT_ASSETS: DefaultAssetTable<ExactDefaultAssetInfo>;
/**
 * Look up a default asset by network and optional ticker.
 *
 * @param network - CAIP-2 or v1 network
 * @param symbol - Ticker; omit for the network default
 * @returns Matching entry
 * @throws If network or ticker is unknown
 */
declare const getDefaultAsset: GetDefaultAsset<ExactDefaultAssetInfo>;
/**
 * Reverse lookup by asset id (case-insensitive) and network.
 *
 * @param asset - Asset address from payment requirements
 * @param network - CAIP-2 or v1 network
 * @returns Matching entry, or undefined
 */
declare const findDefaultAsset: FindDefaultAsset<ExactDefaultAssetInfo>;

export { type DefaultAssetInfo as D, type ExactDefaultAssetInfo as E, DEFAULT_ASSETS as a, findDefaultAsset as f, getDefaultAsset as g };
