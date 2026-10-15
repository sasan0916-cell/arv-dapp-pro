// src/utils.ts
import { isHash, toHex } from "viem";
var EIP155_NETWORK_REGEX = /^eip155:(\d+)$/;
function getEvmChainId(network) {
  if (!network.startsWith("eip155:")) {
    throw new Error(`Unsupported network format: ${network} (expected eip155:CHAIN_ID)`);
  }
  const match = EIP155_NETWORK_REGEX.exec(network);
  if (!match) {
    throw new Error(`Invalid CAIP-2 chain ID: ${network}`);
  }
  const chainId = Number(match[1]);
  if (!Number.isSafeInteger(chainId)) {
    throw new Error(`Invalid CAIP-2 chain ID: ${network}`);
  }
  return chainId;
}
function getCrypto() {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj) {
    throw new Error("Crypto API not available");
  }
  return cryptoObj;
}
function createNonce() {
  return toHex(getCrypto().getRandomValues(new Uint8Array(32)));
}
function createPermit2Nonce() {
  const randomBytes = getCrypto().getRandomValues(new Uint8Array(32));
  return BigInt(toHex(randomBytes)).toString();
}
var MAX_ERROR_MESSAGE_LENGTH = 500;
function truncateErrorMessage(message) {
  return message.slice(0, MAX_ERROR_MESSAGE_LENGTH);
}
function finalHashFromTwoRequestSend(txHashes) {
  if (txHashes.length !== 1 && txHashes.length !== 2) {
    return void 0;
  }
  return txHashes[txHashes.length - 1];
}
function isValidTxHash(hash) {
  return isHash(hash) && !/^0x0+$/.test(hash);
}
function invalidBroadcastHashResponse(tx, errorReason, network, payer) {
  return {
    success: false,
    errorReason,
    errorMessage: `signer returned an invalid transaction hash: ${typeof tx === "string" ? tx : JSON.stringify(tx)}`,
    transaction: "",
    network,
    payer
  };
}

export {
  getEvmChainId,
  createNonce,
  createPermit2Nonce,
  truncateErrorMessage,
  finalHashFromTwoRequestSend,
  isValidTxHash,
  invalidBroadcastHashResponse
};
//# sourceMappingURL=chunk-EKCH75YB.mjs.map