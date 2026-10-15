"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/upto/server/index.ts
var server_exports = {};
__export(server_exports, {
  UptoEvmScheme: () => UptoEvmScheme
});
module.exports = __toCommonJS(server_exports);

// src/upto/server/scheme.ts
var import_utils = require("@x402/core/utils");
var import_viem = require("viem");

// src/constants.ts
var EVM_NETWORK_CHAIN_ID_MAP = {
  ethereum: 1,
  sepolia: 11155111,
  abstract: 2741,
  "abstract-testnet": 11124,
  "base-sepolia": 84532,
  base: 8453,
  "avalanche-fuji": 43113,
  avalanche: 43114,
  iotex: 4689,
  sei: 1329,
  "sei-testnet": 1328,
  polygon: 137,
  "polygon-amoy": 80002,
  peaq: 3338,
  story: 1514,
  educhain: 41923,
  "skale-base-sepolia": 324705682,
  megaeth: 4326,
  monad: 143,
  "monad-testnet": 10143,
  stable: 988,
  "stable-testnet": 2201,
  celo: 42220,
  flare: 14
};
var NETWORKS = Object.keys(EVM_NETWORK_CHAIN_ID_MAP);

// src/defaultAssets.ts
var DEFAULT_ASSETS = {
  "eip155:8453": [
    {
      asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Base mainnet USDC
  "eip155:84532": [
    {
      asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Base Sepolia USDC
  "eip155:1": [
    {
      asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Ethereum mainnet USDC
  "eip155:43114": [
    {
      asset: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Avalanche C-Chain USDC
  "eip155:4326": [
    {
      asset: "0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7",
      name: "MegaUSD",
      version: "1",
      decimals: 18,
      symbol: "MegaUSD",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // MegaETH mainnet MegaUSD (no EIP-3009, supports EIP-2612)
  "eip155:143": [
    {
      asset: "0x754704Bc059F8C67012fEd69BC8A327a5aafb603",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Monad mainnet USDC
  "eip155:10143": [
    {
      asset: "0x534b2f3A21130d7a60830c2Df862319e593943A3",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Monad testnet USDC
  "eip155:988": [
    {
      asset: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
      name: "USDT0",
      version: "1",
      decimals: 6,
      symbol: "USDT0"
    }
  ],
  // Stable mainnet USDT0
  "eip155:2201": [
    {
      asset: "0x78Cf24370174180738C5B8E352B6D14c83a6c9A9",
      name: "USDT0",
      version: "1",
      decimals: 6,
      symbol: "USDT0"
    }
  ],
  // Stable testnet USDT0
  "eip155:137": [
    {
      asset: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Polygon mainnet USDC
  "eip155:42161": [
    {
      asset: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Arbitrum One USDC
  "eip155:421614": [
    {
      asset: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      name: "USD Coin",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Arbitrum Sepolia USDC
  "eip155:31612": [
    {
      asset: "0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186",
      name: "Mezo USD",
      version: "1",
      decimals: 18,
      symbol: "mUSD",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // Mezo mainnet mUSD (no EIP-3009, supports EIP-2612)
  "eip155:31611": [
    {
      asset: "0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503",
      name: "Mezo USD",
      version: "1",
      decimals: 18,
      symbol: "mUSD",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // Mezo Testnet mUSD (no EIP-3009, supports EIP-2612)
  "eip155:723487": [
    {
      asset: "0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb",
      name: "Stable Coin",
      version: "1",
      decimals: 6,
      symbol: "SBC",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // Radius Network SBC (no EIP-3009, supports EIP-2612)
  "eip155:72344": [
    {
      asset: "0x33ad9e4BD16B69B5BFdED37D8B5D9fF9aba014Fb",
      name: "Stable Coin",
      version: "1",
      decimals: 6,
      symbol: "SBC",
      assetTransferMethod: "permit2",
      supportsEip2612: true
    }
  ],
  // Radius Testnet SBC (no EIP-3009, supports EIP-2612)
  "eip155:36900": [
    {
      asset: "0x9cb8142aEBBcdc60AF7c97Af897A67A8f3CA71C2",
      name: "USDC.e",
      version: "2",
      decimals: 6,
      symbol: "USDC.e"
    }
  ],
  // ADI Chain USDC.e (EIP-3009 supported)
  "eip155:190415": [
    {
      asset: "0x401eCb1D350407f13ba348573E5630B83638E30D",
      name: "Bridged USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC.e"
    }
  ],
  // HPP mainnet USDC.e
  "eip155:181228": [
    {
      asset: "0x401eCb1D350407f13ba348573E5630B83638E30D",
      name: "Bridged USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC.e"
    }
  ],
  // HPP Sepolia USDC.e
  "eip155:50": [
    {
      asset: "0xfA2958CB79b0491CC627c1557F441eF849Ca8eb1",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // XDC Network mainnet USDC (Bridged USDC Standard, EIP-3009 supported)
  "eip155:51": [
    {
      asset: "0xb5AB69F7bBada22B28e79C8FFAECe55eF1c771D4",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // XDC Apothem testnet USDC (Bridged USDC Standard, EIP-3009 supported)
  "eip155:38833": [
    {
      asset: "0xA5b8BF902b2844dA17d4506cc827F7F1681735E7",
      name: "USDC",
      version: "1",
      decimals: 6,
      symbol: "USDC",
      assetTransferMethod: "permit2"
    }
  ],
  // Igra mainnet USDC (no EIP-3009, no EIP-2612)
  "eip155:14": [
    {
      asset: "0xe7cd86e13AC4309349F30B3435a9d337750fC82D",
      name: "USD\u20AE0",
      version: "1",
      decimals: 6,
      symbol: "USDT0"
    }
  ],
  // Flare mainnet USD₮0 (EIP-3009 supported)
  "eip155:42220": [
    {
      asset: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    },
    {
      asset: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      name: "Tether USD",
      version: "1",
      decimals: 6,
      symbol: "USDT"
    },
    {
      asset: "0xD2ab3C9A02DBBAB236BfEC45D1d755DF4267F771",
      name: "Tether America USD",
      version: "1",
      decimals: 6,
      symbol: "USAT"
    }
  ],
  // Celo mainnet USDC, USDT, USAT (EIP-3009 supported)
  "eip155:11142220": [
    {
      asset: "0x01C5C0122039549AD1493B8220cABEdD739BC44E",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Celo Sepolia testnet USDC (EIP-3009 supported)
  "eip155:1329": [
    {
      asset: "0xe15fC38F6D8c56aF07bbCBe3BAf5708A2Bf42392",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Sei mainnet USDC (EIP-3009 supported)
  "eip155:1328": [
    {
      asset: "0x4fCF1784B31630811181f670Aea7A7bEF803eaED",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Sei testnet USDC (EIP-3009 supported)
  "eip155:5042": [
    {
      asset: "0x3600000000000000000000000000000000000000",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ],
  // Arc mainnet USDC (EIP-3009 supported)
  "eip155:5042002": [
    {
      asset: "0x3600000000000000000000000000000000000000",
      name: "USDC",
      version: "2",
      decimals: 6,
      symbol: "USDC"
    }
  ]
  // Arc Testnet USDC (EIP-3009 supported)
};
function resolveNetworkKey(network) {
  if (network in DEFAULT_ASSETS) {
    return network;
  }
  const chainId = EVM_NETWORK_CHAIN_ID_MAP[network];
  if (chainId !== void 0) {
    return `eip155:${chainId}`;
  }
  return network;
}
var getDefaultAsset = (network, symbol) => {
  const key = resolveNetworkKey(network);
  const assets = DEFAULT_ASSETS[key];
  if (!assets || assets.length === 0) {
    throw new Error(`No default asset configured for network ${network}`);
  }
  if (!symbol) {
    return assets[0];
  }
  const normalized = symbol.toUpperCase();
  const match = assets.find((entry) => entry.symbol.toUpperCase() === normalized);
  if (!match) {
    throw new Error(`No ${symbol} default asset configured for network ${network}`);
  }
  return match;
};
var findDefaultAsset = (asset, network) => {
  const key = resolveNetworkKey(network);
  const assets = DEFAULT_ASSETS[key];
  if (!assets) {
    return void 0;
  }
  const normalized = asset.toLowerCase();
  return assets.find((entry) => entry.asset.toLowerCase() === normalized);
};

// src/upto/server/scheme.ts
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
    const { amount, symbol } = (0, import_utils.parseMoney)(price);
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
        ...supportedKind.extra?.facilitatorAddress ? { facilitatorAddress: (0, import_viem.getAddress)(supportedKind.extra.facilitatorAddress) } : {}
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
    const tokenAmount = (0, import_utils.convertToTokenAmount)(amount, assetInfo.decimals);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UptoEvmScheme
});
//# sourceMappingURL=index.js.map