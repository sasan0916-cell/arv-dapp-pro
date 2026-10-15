import {
  findDefaultAsset,
  getDefaultAsset
} from "../../chunk-LQQ3M4DU.mjs";
import "../../chunk-GPMYUGHX.mjs";

// src/exact/server/scheme.ts
import { convertToTokenAmount, parseMoney } from "@x402/core/utils";
var ExactEvmScheme = class {
  constructor() {
    this.scheme = "exact";
    this.defaultAssetTransferMethod = "eip3009";
    this.paymentFlows = {
      eip3009: { supported: ["authorization", "upfront"], default: "authorization" },
      permit2: { supported: ["authorization", "upfront"], default: "authorization" }
    };
    this.moneyParsers = [];
  }
  /**
   * Register a custom money parser in the parser chain.
   * Multiple parsers can be registered - they will be tried in registration order.
   * Each parser receives a decimal string (e.g., "1.50" for $1.50).
   * If a parser returns null, the next parser in the chain will be tried.
   * The default parser is always the final fallback.
   *
   * @param parser - Custom function to convert amount to AssetAmount (or null to skip)
   * @returns The server instance for chaining
   *
   * @example
   * evmServer.registerMoneyParser(async (amount, network) => {
   *   // Custom conversion logic
   *   if (Number(amount) > 100) {
   *     // Use different token for large amounts
   *     return { amount: convertToTokenAmount(String(amount), 18), asset: "0xCustomToken" };
   *   }
   *   return null; // Use next parser
   * });
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
   * Parses a price into an asset amount.
   * If price is already an AssetAmount, returns it directly.
   * If price is Money (string | number), parses to decimal and tries custom parsers.
   * Falls back to default conversion if all custom parsers return null.
   *
   * @param price - The price to parse
   * @param network - The network to use
   * @returns Promise that resolves to the parsed asset amount
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
   * Build payment requirements for this scheme/network combination
   *
   * @param paymentRequirements - The base payment requirements
   * @param supportedKind - The supported kind from facilitator (unused)
   * @param supportedKind.x402Version - The x402 version
   * @param supportedKind.scheme - The logical payment scheme
   * @param supportedKind.network - The network identifier in CAIP-2 format
   * @param supportedKind.extra - Optional extra metadata regarding scheme/network implementation details
   * @param extensionKeys - Extension keys supported by the facilitator (unused)
   * @returns Payment requirements ready to be sent to clients
   */
  enhancePaymentRequirements(paymentRequirements, supportedKind, extensionKeys) {
    void supportedKind;
    void extensionKeys;
    return Promise.resolve(paymentRequirements);
  }
  /**
   * Converts a numeric dollar amount to an AssetAmount using the default token for the network.
   *
   * @param amount - The decimal amount as a string
   * @param network - The target network
   * @param symbol - Optional ticker from a suffixed price
   * @returns The converted asset amount with token metadata
   */
  defaultMoneyConversion(amount, network, symbol) {
    const assetInfo = getDefaultAsset(network, symbol);
    const tokenAmount = convertToTokenAmount(amount, assetInfo.decimals);
    const includeEip712Domain = !assetInfo.assetTransferMethod || assetInfo.supportsEip2612;
    return {
      amount: tokenAmount,
      asset: assetInfo.asset,
      extra: {
        ...includeEip712Domain && {
          name: assetInfo.name,
          version: assetInfo.version
        },
        ...assetInfo.assetTransferMethod && {
          assetTransferMethod: assetInfo.assetTransferMethod
        }
      }
    };
  }
};

// src/exact/server/register.ts
function registerExactEvmScheme(server, config = {}) {
  if (config.networks && config.networks.length > 0) {
    config.networks.forEach((network) => {
      server.register(network, new ExactEvmScheme());
    });
  } else {
    server.register("eip155:*", new ExactEvmScheme());
  }
  return server;
}
export {
  ExactEvmScheme,
  registerExactEvmScheme
};
//# sourceMappingURL=index.mjs.map