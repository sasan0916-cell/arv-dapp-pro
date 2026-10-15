// src/batch-settlement/encoding.ts
import { encodeAbiParameters, keccak256 } from "viem";
function buildErc3009DepositNonce(channelId, salt) {
  return keccak256(
    encodeAbiParameters([{ type: "bytes32" }, { type: "uint256" }], [channelId, BigInt(salt)])
  );
}
function buildErc3009CollectorData(validAfter, validBefore, salt, signature) {
  return encodeAbiParameters(
    [{ type: "uint256" }, { type: "uint256" }, { type: "uint256" }, { type: "bytes" }],
    [BigInt(validAfter), BigInt(validBefore), BigInt(salt), signature]
  );
}
function buildEip2612PermitData(params) {
  return encodeAbiParameters(
    [
      { type: "uint256" },
      { type: "uint256" },
      { type: "uint8" },
      { type: "bytes32" },
      { type: "bytes32" }
    ],
    [BigInt(params.value), BigInt(params.deadline), params.v, params.r, params.s]
  );
}
function buildPermit2CollectorData(nonce, deadline, permit2Signature, eip2612PermitData = "0x") {
  return encodeAbiParameters(
    [{ type: "uint256" }, { type: "uint256" }, { type: "bytes" }, { type: "bytes" }],
    [BigInt(nonce), BigInt(deadline), permit2Signature, eip2612PermitData]
  );
}

export {
  buildErc3009DepositNonce,
  buildErc3009CollectorData,
  buildEip2612PermitData,
  buildPermit2CollectorData
};
//# sourceMappingURL=chunk-W6ON4LG2.mjs.map