import { SchemeNetworkServer, MoneyParser, Network, Price, AssetAmount, PaymentRequirements } from '@x402/core/types';
import { A as AssetTransferMethod } from '../../types-BBC1mC8d.js';

/**
 * EVM server implementation for the Upto payment scheme.
 * Handles price parsing, payment requirements enhancement, and default asset resolution.
 */
declare class UptoEvmScheme implements SchemeNetworkServer {
    readonly scheme = "upto";
    readonly defaultAssetTransferMethod: AssetTransferMethod;
    readonly paymentFlows: {
        readonly permit2: {
            readonly supported: readonly ["authorization"];
            readonly default: "authorization";
        };
    };
    private moneyParsers;
    /**
     * Registers a custom money parser for converting prices to asset amounts.
     *
     * @param parser - The money parser function to register
     * @returns This instance for chaining
     */
    registerMoneyParser(parser: MoneyParser): UptoEvmScheme;
    /**
     * Decimals for a known default asset, or undefined.
     *
     * @param asset - Asset address or symbol
     * @param network - Target network
     * @returns Decimals when the asset is a known default; otherwise undefined
     */
    getAssetDecimals(asset: string, network: Network): number | undefined;
    /**
     * Parses a price into an asset amount for the given network.
     *
     * @param price - The price to parse (string, number, or AssetAmount)
     * @param network - The target network
     * @returns Promise resolving to an asset amount
     */
    parsePrice(price: Price, network: Network): Promise<AssetAmount>;
    /**
     * Enhances payment requirements with upto-specific metadata.
     *
     * @param paymentRequirements - The base payment requirements
     * @param supportedKind - The supported scheme/network kind
     * @param supportedKind.x402Version - The x402 protocol version
     * @param supportedKind.scheme - The payment scheme name
     * @param supportedKind.network - The target network
     * @param supportedKind.extra - Optional extra metadata
     * @param extensionKeys - Extension keys to include
     * @returns Promise resolving to enhanced payment requirements
     */
    enhancePaymentRequirements(paymentRequirements: PaymentRequirements, supportedKind: {
        x402Version: number;
        scheme: string;
        network: Network;
        extra?: Record<string, unknown>;
    }, extensionKeys: string[]): Promise<PaymentRequirements>;
    /**
     * Converts a decimal dollar amount to an AssetAmount using the default token for the network.
     *
     * @param amount - The decimal amount as a string
     * @param network - The target network
     * @param symbol - Optional ticker from a suffixed price
     * @returns The converted asset amount with token metadata
     */
    private defaultMoneyConversion;
}

export { UptoEvmScheme };
