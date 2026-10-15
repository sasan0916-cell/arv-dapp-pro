// src/shared/verifySignature.ts
import {
  hashTypedData,
  recoverAddress,
  isAddressEqual,
  getAddress,
  parseErc6492Signature
} from "viem";
var ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
async function classifyErc6492Payer(signer, signature, payerAddress) {
  const erc6492Data = parseErc6492Signature(signature);
  const hasDeploymentInfo = !!(erc6492Data.address && erc6492Data.data && !isAddressEqual(erc6492Data.address, ZERO_ADDRESS));
  const innerSignature = hasDeploymentInfo ? erc6492Data.signature : signature;
  const eip6492Deployment = hasDeploymentInfo ? { factoryAddress: erc6492Data.address, factoryCalldata: erc6492Data.data } : void 0;
  let code;
  try {
    code = await signer.getCode({ address: payerAddress });
  } catch {
    code = void 0;
  }
  const isDeployedAtPayer = !!(code && code !== "0x");
  const isCounterfactual = hasDeploymentInfo && !isDeployedAtPayer;
  return {
    isCounterfactual,
    isDeployedAtPayer,
    hasDeploymentInfo,
    innerSignature,
    eip6492Deployment
  };
}
var ERC1271_MAGIC_VALUE = "0x1626ba7e";
var ERC1271_ABI = [
  {
    name: "isValidSignature",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "hash", type: "bytes32" },
      { name: "signature", type: "bytes" }
    ],
    outputs: [{ name: "", type: "bytes4" }]
  }
];
async function verifyTypedDataSignature(signer, params) {
  let digest;
  try {
    digest = hashTypedData({
      domain: params.domain,
      types: params.types,
      primaryType: params.primaryType,
      message: params.message
    });
  } catch {
    return false;
  }
  return verifyHashSignature(signer, params.address, digest, params.signature);
}
async function verifyHashSignature(signer, address, digest, signature) {
  let code;
  try {
    code = await signer.getCode({ address });
  } catch {
    return false;
  }
  return verifyHashSignatureWithCode(signer, address, code, digest, signature);
}
function verifyHashSignatureWithCode(signer, address, code, digest, signature) {
  if (!code || code === "0x") {
    return verifyECDSA(address, digest, signature);
  }
  return verifyERC1271(signer, address, digest, signature);
}
async function verifyECDSA(address, digest, signature) {
  const sigHex = signature.startsWith("0x") ? signature.slice(2) : signature;
  if (sigHex.length !== 130) return false;
  try {
    const recovered = await recoverAddress({ hash: digest, signature });
    return isAddressEqual(getAddress(recovered), getAddress(address));
  } catch {
    return false;
  }
}
async function verifyERC1271(signer, address, digest, signature) {
  try {
    const result = await signer.readContract({
      address,
      abi: ERC1271_ABI,
      functionName: "isValidSignature",
      args: [digest, signature]
    });
    if (typeof result !== "string") return false;
    return result.toLowerCase().startsWith(ERC1271_MAGIC_VALUE);
  } catch {
    return false;
  }
}

export {
  classifyErc6492Payer,
  verifyTypedDataSignature,
  verifyHashSignature,
  verifyHashSignatureWithCode
};
//# sourceMappingURL=chunk-BEMCJZKA.mjs.map