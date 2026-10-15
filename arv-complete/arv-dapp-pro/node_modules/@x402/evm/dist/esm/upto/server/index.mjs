import {
  findDefaultAsset,
  getDefaultAsset
} from "../../chunk-LQQ3M4DU.mjs";
import "../../chunk-GPMYUGHX.mjs";

// src/upto/server/scheme.ts
import { convertToTokenAmount, parseMoney } from "@x402/core/utils";
import { getAddress } from "viem";
var UptoEvmScheme = class {
  constructor() {
    this.scheme = "upto";
    this.defaultAssetTransferMethod = "permit2";
    this.paymentFlows = {
      permit2: { supported: ["authorization"], default: "authorization" }
    };
    this.moneyParsers = [];
  }
  /**
   * Registers a custom money parser for converting prices to asset amounts.
   *
   * @param parser - The money parser function to register
   * @returns This instance for chaining
   */
  registerMoneyParser(parser) {
    this.moneyParsers.push(parser);
    return this;
  }
  /**
   * Decimals for a known default asset, or undefined.
   *
   * @param asset - Asset address or symbol
   * @param network - Target network
   * @returns Decimals when the asset is a known default; otherwise undefined
   */
  getAssetDecimals(asset, network) {
    return findDefaultAsset(asset, network)?.decimals;
  }
  /**
   * Parses a price into an asset amount for the given network.
   *
   * @param price - The price to parse (string, number, or AssetAmount)
   * @param network - The target network
   * @returns Promise resolving to an asset amount
   */
  async parsePrice(price, network) {
    if (typeof price === "object" && price !== null && "amount" in price) {
      if (!price.asset) {
        throw new Error(`Asset address must be specified for AssetAmount on network ${network}`);
      }
      return {
        amount: price.amount,
        asset: price.asset,
        extra: price.extra || {}
      };
    }
    const { amount, symbol } = parseMoney(price);
    for (const parser of this.moneyParsers) {
      const result = await parser(amount, network);
      if (result !== null) {
        return result;
      }
    }
    return this.defaultMoneyConversion(amount, network, symbol);
  }
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
  enhancePaymentRequirements(paymentRequirements, supportedKind, extensionKeys) {
    void extensionKeys;
    return Promise.resolve({
      ...paymentRequirements,
      extra: {
        ...paymentRequirements.extra,
        assetTransferMethod: "permit2",
        ...supportedKind.extra?.facilitatorAddress ? { facilitatorAddress: getAddress(supportedKind.extra.facilitatorAddress) } : {}
      }
    });
  }
  /**
   * Converts a decimal dollar amount to an AssetAmount using the default token for the network.
   *
   * @param amount - The decimal amount as a string
   * @param network - The target network
   * @param symbol - Optional ticker from a suffixed price
   * @returns The converted asset amount with token metadata
   */
  defaultMoneyConversion(amount, network, symbol) {
    const assetInfo = getDefaultAsset(network, symbol);
    const tokenAmount = convertToTokenAmount(amount, assetInfo.decimals);
    return {
      amount: tokenAmount,
      asset: assetInfo.asset,
      extra: {
        name: assetInfo.name,
        version: assetInfo.version,
        assetTransferMethod: "permit2"
      }
    };
  }
};
export {
  UptoEvmScheme
};
//# sourceMappingURL=index.mjs.map