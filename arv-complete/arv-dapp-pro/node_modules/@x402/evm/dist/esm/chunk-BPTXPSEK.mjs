import {
  ErrAssetNotDeployedContract
} from "./chunk-VEDHRFNU.mjs";

// src/types.ts
function isPermit2Payload(payload) {
  return "permit2Authorization" in payload;
}
function isEIP3009Payload(payload) {
  return "authorization" in payload;
}
function isUptoPermit2Payload(payload) {
  if (typeof payload.signature !== "string") return false;
  if (!("permit2Authorization" in payload)) return false;
  const auth = payload.permit2Authorization;
  if (typeof auth !== "object" || auth === null) return false;
  const a = auth;
  if (typeof a.from !== "string") return false;
  if (typeof a.spender !== "string") return false;
  if (typeof a.nonce !== "string") return false;
  if (typeof a.deadline !== "string") return false;
  const permitted = a.permitted;
  if (typeof permitted !== "object" || permitted === null) return false;
  const p = permitted;
  if (typeof p.token !== "string") return false;
  if (typeof p.amount !== "string") return false;
  const witness = a.witness;
  if (typeof witness !== "object" || witness === null) return false;
  const w = witness;
  return typeof w.facilitator === "string" && typeof w.to === "string" && typeof w.validAfter === "string";
}

// src/assetCache.ts
import { getAddress } from "viem";
var DEFAULT_ASSET_CONTRACT_CACHE_TTL_MS = 15 * 60 * 1e3;
var MAX_ASSET_CONTRACT_CACHE_ENTRIES = 4096;
var cacheKey = (key) => `${key.network}\0${key.asset}`;
var normalizeAsset = (asset) => getAddress(asset).toLowerCase();
var globalAssetContractCache = {
  ttl: DEFAULT_ASSET_CONTRACT_CACHE_TTL_MS,
  // Node's event loop is single-threaded, so a plain Map is enough; Go needs RWMutex.
  expiries: /* @__PURE__ */ new Map(),
  isFresh(key, now) {
    if (key.network === "") {
      return false;
    }
    const expiry = this.expiries.get(cacheKey(key));
    return expiry !== void 0 && now < expiry;
  },
  record(key, now) {
    if (key.network === "") {
      return;
    }
    for (const [existing, expiry] of this.expiries) {
      if (now > expiry) {
        this.expiries.delete(existing);
      }
    }
    const serialized = cacheKey(key);
    if (!this.expiries.has(serialized) && this.expiries.size >= MAX_ASSET_CONTRACT_CACHE_ENTRIES) {
      return;
    }
    this.expiries.set(serialized, now + this.ttl);
  }
};
function resetAssetContractCache() {
  globalAssetContractCache.expiries = /* @__PURE__ */ new Map();
}
async function validateAssetIsContract(signer, network, asset) {
  const normalizedAsset = normalizeAsset(asset);
  if (globalAssetContractCache.isFresh({ network, asset: normalizedAsset }, Date.now())) {
    return "";
  }
  let code;
  try {
    code = await signer.getCode({ address: getAddress(asset) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`failed to check whether asset is a contract: ${message}`);
  }
  if (!code || code === "0x") {
    return ErrAssetNotDeployedContract;
  }
  return "";
}
var AssetContractCheck = class {
  /**
   * Starts {@link validateAssetIsContract} immediately. Cache recording waits for {@link AssetContractCheck.await}.
   *
   * @param signer - Facilitator signer used to call eth_getCode on the asset.
   * @param network - CAIP-2 network id that scopes the cache; empty disables caching.
   * @param asset - Payment token address.
   */
  constructor(signer, network, asset) {
    this.network = network;
    this.asset = asset;
    this.results = validateAssetIsContract(signer, network, asset);
  }
  /**
   * Returns the check's result, caching a positive one for {@link DEFAULT_ASSET_CONTRACT_CACHE_TTL_MS}.
   * Recording on await rather than when the Promise settles keeps cache contents independent of
   * scheduling: a check abandoned by an early return cannot publish a result.
   *
   * @returns An empty string when the asset is a contract, or {@link ErrAssetNotDeployedContract}.
   */
  async await() {
    const reason = await this.results;
    if (reason === "") {
      globalAssetContractCache.record(
        { network: this.network, asset: normalizeAsset(this.asset) },
        Date.now()
      );
    }
    return reason;
  }
};
function startAssetContractCheck(signer, network, asset) {
  return new AssetContractCheck(signer, network, asset);
}

export {
  isPermit2Payload,
  isEIP3009Payload,
  isUptoPermit2Payload,
  DEFAULT_ASSET_CONTRACT_CACHE_TTL_MS,
  resetAssetContractCache,
  validateAssetIsContract,
  startAssetContractCheck
};
//# sourceMappingURL=chunk-BPTXPSEK.mjs.map