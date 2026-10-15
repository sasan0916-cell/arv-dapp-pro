import {
  getEvmChainId
} from "./chunk-EKCH75YB.mjs";
import {
  findDefaultAsset
} from "./chunk-LQQ3M4DU.mjs";
import {
  PERMIT2_ADDRESS
} from "./chunk-GPMYUGHX.mjs";

// src/auth-capture/constants.ts
import { getAddress, isAddress, isAddressEqual, keccak256, toBytes } from "viem";
var AUTH_CAPTURE_SCHEME = "auth-capture";
var AUTH_CAPTURE_ESCROW_V1_0_ADDRESS = "0xBdEA0D1bcC5966192B070Fdf62aB4EF5b4420cff";
var EIP3009_TOKEN_COLLECTOR_V1_0_ADDRESS = "0x0E3dF9510de65469C4518D7843919c0b8C7A7757";
var PERMIT2_TOKEN_COLLECTOR_V1_0_ADDRESS = "0x992476B9Ee81d52a5BdA0622C333938D0Af0aB26";
var OPERATOR_REFUND_COLLECTOR_V1_0_ADDRESS = "0x934907bffd0901b6A21e398B9C53A4A38F02fa5d";
var AUTH_CAPTURE_ESCROW_V1_1_ADDRESS = "0xf96815976523E00e65Be8f34cA5e64b4f41EB19c";
var EIP3009_TOKEN_COLLECTOR_V1_1_ADDRESS = "0x8612dfdc421f80336cd14E8EF9cb1E765dB5ab88";
var PERMIT2_TOKEN_COLLECTOR_V1_1_ADDRESS = "0xD69831Aed5bfe262067ec4c751f4F830EcdD446e";
var OPERATOR_REFUND_COLLECTOR_V1_1_ADDRESS = "0x7a03443724d14798c4AB4622F1DAAcA761Fea486";
var AUTH_CAPTURE_ESCROW_ADDRESS = AUTH_CAPTURE_ESCROW_V1_1_ADDRESS;
var EIP3009_TOKEN_COLLECTOR_ADDRESS = EIP3009_TOKEN_COLLECTOR_V1_1_ADDRESS;
var PERMIT2_TOKEN_COLLECTOR_ADDRESS = PERMIT2_TOKEN_COLLECTOR_V1_1_ADDRESS;
var OPERATOR_REFUND_COLLECTOR_ADDRESS = OPERATOR_REFUND_COLLECTOR_V1_1_ADDRESS;
var AUTH_CAPTURE_DEPLOYMENT_V1_0 = {
  version: "v1.0",
  escrow: AUTH_CAPTURE_ESCROW_V1_0_ADDRESS,
  eip3009Collector: EIP3009_TOKEN_COLLECTOR_V1_0_ADDRESS,
  permit2Collector: PERMIT2_TOKEN_COLLECTOR_V1_0_ADDRESS,
  operatorRefundCollector: OPERATOR_REFUND_COLLECTOR_V1_0_ADDRESS
};
var AUTH_CAPTURE_DEPLOYMENT_V1_1 = {
  version: "v1.1",
  escrow: AUTH_CAPTURE_ESCROW_V1_1_ADDRESS,
  eip3009Collector: EIP3009_TOKEN_COLLECTOR_V1_1_ADDRESS,
  permit2Collector: PERMIT2_TOKEN_COLLECTOR_V1_1_ADDRESS,
  operatorRefundCollector: OPERATOR_REFUND_COLLECTOR_V1_1_ADDRESS
};
function resolveAuthCaptureDeployment(escrow) {
  if (escrow === void 0 || escrow === "") {
    return AUTH_CAPTURE_DEPLOYMENT_V1_1;
  }
  if (!isAddress(escrow)) {
    return void 0;
  }
  const normalized = getAddress(escrow);
  if (isAddressEqual(normalized, AUTH_CAPTURE_ESCROW_V1_1_ADDRESS) || isAddressEqual(normalized, AUTH_CAPTURE_ESCROW_ADDRESS)) {
    return AUTH_CAPTURE_DEPLOYMENT_V1_1;
  }
  if (isAddressEqual(normalized, AUTH_CAPTURE_ESCROW_V1_0_ADDRESS)) {
    return AUTH_CAPTURE_DEPLOYMENT_V1_0;
  }
  return void 0;
}
var SALT_BINDING_TYPEHASH = keccak256(
  toBytes(
    "x402AuthCaptureSaltBinding(address receiverAuthorizer,address policy,uint256 saltNonce)"
  )
);
var RECEIVE_AUTHORIZATION_TYPES = {
  ReceiveWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" }
  ]
};
var PERMIT2_TRANSFER_FROM_TYPES = {
  PermitTransferFrom: [
    { name: "permitted", type: "TokenPermissions" },
    { name: "spender", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ],
  TokenPermissions: [
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" }
  ]
};

// src/auth-capture/client/scheme.ts
import { hexToBigInt } from "viem";

// src/auth-capture/nonce.ts
import {
  encodeAbiParameters,
  getAddress as getAddress2,
  isAddress as isAddress2,
  isAddressEqual as isAddressEqual2,
  keccak256 as keccak2562,
  toHex,
  zeroAddress
} from "viem";
var PAYMENT_INFO_TYPEHASH = keccak2562(
  new TextEncoder().encode(
    "PaymentInfo(address operator,address payer,address receiver,address token,uint120 maxAmount,uint48 preApprovalExpiry,uint48 authorizationExpiry,uint48 refundExpiry,uint16 minFeeBps,uint16 maxFeeBps,address feeReceiver,uint256 salt)"
  )
);
function hashPaymentInfo(chainId, paymentInfo, payer, escrowAddress = AUTH_CAPTURE_ESCROW_ADDRESS) {
  const paymentInfoEncoded = encodeAbiParameters(
    [
      { name: "typehash", type: "bytes32" },
      { name: "operator", type: "address" },
      { name: "payer", type: "address" },
      { name: "receiver", type: "address" },
      { name: "token", type: "address" },
      { name: "maxAmount", type: "uint120" },
      { name: "preApprovalExpiry", type: "uint48" },
      { name: "authorizationExpiry", type: "uint48" },
      { name: "refundExpiry", type: "uint48" },
      { name: "minFeeBps", type: "uint16" },
      { name: "maxFeeBps", type: "uint16" },
      { name: "feeReceiver", type: "address" },
      { name: "salt", type: "uint256" }
    ],
    [
      PAYMENT_INFO_TYPEHASH,
      paymentInfo.operator,
      payer,
      paymentInfo.receiver,
      paymentInfo.token,
      BigInt(paymentInfo.maxAmount),
      paymentInfo.preApprovalExpiry,
      paymentInfo.authorizationExpiry,
      paymentInfo.refundExpiry,
      paymentInfo.minFeeBps,
      paymentInfo.maxFeeBps,
      paymentInfo.feeReceiver,
      BigInt(paymentInfo.salt)
    ]
  );
  const paymentInfoHash = keccak2562(paymentInfoEncoded);
  const outerEncoded = encodeAbiParameters(
    [
      { name: "chainId", type: "uint256" },
      { name: "escrow", type: "address" },
      { name: "paymentInfoHash", type: "bytes32" }
    ],
    [BigInt(chainId), escrowAddress, paymentInfoHash]
  );
  return keccak2562(outerEncoded);
}
function computePayerAgnosticPaymentInfoHash(chainId, paymentInfo, escrowAddress = AUTH_CAPTURE_ESCROW_ADDRESS) {
  return hashPaymentInfo(chainId, paymentInfo, zeroAddress, escrowAddress);
}
async function signERC3009(signer, authorization, extra, tokenAddress, chainId) {
  const domain = {
    name: extra.name,
    version: extra.version,
    chainId,
    verifyingContract: getAddress2(tokenAddress)
  };
  const message = {
    from: getAddress2(authorization.from),
    to: getAddress2(authorization.to),
    value: BigInt(authorization.value),
    validAfter: BigInt(authorization.validAfter),
    validBefore: BigInt(authorization.validBefore),
    nonce: authorization.nonce
  };
  return signer.signTypedData({
    domain,
    types: RECEIVE_AUTHORIZATION_TYPES,
    primaryType: "ReceiveWithAuthorization",
    message
  });
}
async function signPermit2(signer, permit, chainId) {
  const domain = {
    name: "Permit2",
    chainId,
    verifyingContract: PERMIT2_ADDRESS
  };
  const message = {
    permitted: {
      token: getAddress2(permit.permitted.token),
      amount: BigInt(permit.permitted.amount)
    },
    spender: getAddress2(permit.spender),
    nonce: BigInt(permit.nonce),
    deadline: BigInt(permit.deadline)
  };
  return signer.signTypedData({
    domain,
    types: PERMIT2_TRANSFER_FROM_TYPES,
    primaryType: "PermitTransferFrom",
    message
  });
}
function generateSalt() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}
function extraAddress(value) {
  if (!value || !isAddress2(value)) return zeroAddress;
  return getAddress2(value);
}
function isNonZeroAddress(value) {
  if (!value || !isAddress2(value)) return false;
  return !isAddressEqual2(getAddress2(value), zeroAddress);
}
function isSaltBindingOn(extra) {
  return isNonZeroAddress(extra.receiverAuthorizer) || isNonZeroAddress(extra.policy);
}
function deriveBoundSalt(receiverAuthorizer, policy, saltNonce) {
  const encoded = encodeAbiParameters(
    [
      { name: "typehash", type: "bytes32" },
      { name: "receiverAuthorizer", type: "address" },
      { name: "policy", type: "address" },
      { name: "saltNonce", type: "uint256" }
    ],
    [SALT_BINDING_TYPEHASH, receiverAuthorizer, policy, BigInt(saltNonce)]
  );
  return keccak2562(encoded);
}

// src/auth-capture/client/scheme.ts
var AuthCaptureEvmScheme = class {
  /**
   * Construct a client-side auth-capture scheme bound to a specific signer.
   *
   * @param signer - Client-side signer that exposes `address` and `signTypedData`.
   */
  constructor(signer) {
    this.signer = signer;
    this.scheme = AUTH_CAPTURE_SCHEME;
    this.findDefaultAsset = findDefaultAsset;
  }
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
  async createPaymentPayload(x402Version, requirements, _) {
    if (x402Version !== 2) {
      throw new Error(`Unsupported x402Version: ${x402Version}. Only version 2 is supported.`);
    }
    const extra = requirements.extra;
    if (!extra.name) {
      throw new Error(
        `EIP-712 domain parameter 'name' is required in payment requirements for asset ${requirements.asset}`
      );
    }
    if (!extra.version) {
      throw new Error(
        `EIP-712 domain parameter 'version' is required in payment requirements for asset ${requirements.asset}`
      );
    }
    if (!extra.captureAuthorizer) {
      throw new Error(`'captureAuthorizer' is required in payment requirements extra`);
    }
    if (!extra.feeRecipient) {
      throw new Error(`'feeRecipient' is required in payment requirements extra`);
    }
    if (typeof extra.captureDeadline !== "number") {
      throw new Error(`'captureDeadline' is required in payment requirements extra`);
    }
    if (typeof extra.refundDeadline !== "number") {
      throw new Error(`'refundDeadline' is required in payment requirements extra`);
    }
    if (typeof extra.minFeeBps !== "number") {
      throw new Error(`'minFeeBps' is required in payment requirements extra`);
    }
    if (typeof extra.maxFeeBps !== "number") {
      throw new Error(`'maxFeeBps' is required in payment requirements extra`);
    }
    if (typeof requirements.maxTimeoutSeconds !== "number") {
      throw new Error(
        `'maxTimeoutSeconds' is required in PaymentRequirements (used to derive preApprovalExpiry)`
      );
    }
    const chainId = getEvmChainId(requirements.network);
    const deployment = resolveAuthCaptureDeployment(extra.authCaptureEscrow);
    if (!deployment) {
      throw new Error(`Invalid authCaptureEscrow in payment requirements extra`);
    }
    const maxAmount = requirements.amount;
    const nowSeconds = Math.floor(Date.now() / 1e3);
    const preApprovalExpiry = nowSeconds + requirements.maxTimeoutSeconds;
    const assetTransferMethod = extra.assetTransferMethod ?? "eip3009";
    const bindOn = isSaltBindingOn(extra);
    const saltNonce = generateSalt();
    const salt = bindOn ? deriveBoundSalt(
      extraAddress(extra.receiverAuthorizer),
      extraAddress(extra.policy),
      saltNonce
    ) : saltNonce;
    const paymentInfo = {
      operator: extra.captureAuthorizer,
      payer: this.signer.address,
      receiver: requirements.payTo,
      token: requirements.asset,
      maxAmount,
      preApprovalExpiry,
      authorizationExpiry: extra.captureDeadline,
      refundExpiry: extra.refundDeadline,
      minFeeBps: extra.minFeeBps,
      maxFeeBps: extra.maxFeeBps,
      feeReceiver: extra.feeRecipient,
      salt
    };
    const nonce = computePayerAgnosticPaymentInfoHash(chainId, paymentInfo, deployment.escrow);
    if (assetTransferMethod === "permit2") {
      const permit2Authorization = {
        from: this.signer.address,
        permitted: {
          token: requirements.asset,
          amount: maxAmount
        },
        spender: deployment.permit2Collector,
        nonce: hexToBigInt(nonce).toString(),
        deadline: String(preApprovalExpiry)
      };
      const signature2 = await signPermit2(this.signer, permit2Authorization, chainId);
      const payload2 = bindOn ? { permit2Authorization, signature: signature2, salt, saltNonce } : { permit2Authorization, signature: signature2, salt };
      return { x402Version, payload: payload2 };
    }
    const authorization = {
      from: this.signer.address,
      to: deployment.eip3009Collector,
      value: maxAmount,
      validAfter: "0",
      validBefore: String(preApprovalExpiry),
      nonce
    };
    const signature = await signERC3009(
      this.signer,
      authorization,
      extra,
      requirements.asset,
      chainId
    );
    const payload = bindOn ? { authorization, signature, salt, saltNonce } : { authorization, signature, salt };
    return { x402Version, payload };
  }
};

export {
  AUTH_CAPTURE_SCHEME,
  AUTH_CAPTURE_ESCROW_V1_0_ADDRESS,
  EIP3009_TOKEN_COLLECTOR_V1_0_ADDRESS,
  AUTH_CAPTURE_ESCROW_V1_1_ADDRESS,
  AUTH_CAPTURE_ESCROW_ADDRESS,
  EIP3009_TOKEN_COLLECTOR_ADDRESS,
  PERMIT2_TOKEN_COLLECTOR_ADDRESS,
  OPERATOR_REFUND_COLLECTOR_ADDRESS,
  resolveAuthCaptureDeployment,
  AuthCaptureEvmScheme
};
//# sourceMappingURL=chunk-KPBDMMIU.mjs.map