import {
  classifyErc6492Payer,
  verifyTypedDataSignature
} from "./chunk-BEMCJZKA.mjs";
import {
  ErrEip3009InsufficientBalance,
  ErrEip3009NonceAlreadyUsed,
  ErrEip3009NotSupported,
  ErrEip3009SimulationFailed,
  ErrEip3009TokenNameMismatch,
  ErrEip3009TokenVersionMismatch,
  ErrFactoryNotAllowed,
  ErrInvalidAuthorizationValue,
  ErrInvalidScheme,
  ErrInvalidSignature,
  ErrMissingEip712Domain,
  ErrNetworkMismatch,
  ErrRecipientMismatch,
  ErrSmartWalletDeploymentFailed,
  ErrTransactionFailed,
  ErrTransferEventMismatch,
  ErrValidAfterInFuture,
  ErrValidBeforeExpired
} from "./chunk-VEDHRFNU.mjs";
import {
  resolveDataSuffix
} from "./chunk-X4BYNI7R.mjs";
import {
  multicall
} from "./chunk-VS3RYAYE.mjs";
import {
  createNonce
} from "./chunk-EKCH75YB.mjs";
import {
  findDefaultAsset
} from "./chunk-LQQ3M4DU.mjs";
import {
  authorizationTypes,
  eip3009ABI,
  getEvmChainIdV1
} from "./chunk-GPMYUGHX.mjs";

// src/exact/v1/client/scheme.ts
import { getAddress } from "viem";
var ExactEvmSchemeV1 = class {
  /**
   * Creates a new ExactEvmClientV1 instance.
   *
   * @param signer - The EVM signer for client operations
   */
  constructor(signer) {
    this.signer = signer;
    this.scheme = "exact";
    this.findDefaultAsset = findDefaultAsset;
  }
  /**
   * Creates a payment payload for the Exact scheme (V1).
   *
   * @param x402Version - The x402 protocol version
   * @param paymentRequirements - The payment requirements
   * @returns Promise resolving to a payment payload
   */
  async createPaymentPayload(x402Version, paymentRequirements) {
    const selectedV1 = paymentRequirements;
    const nonce = createNonce();
    const now = Math.floor(Date.now() / 1e3);
    const authorization = {
      from: this.signer.address,
      to: getAddress(selectedV1.payTo),
      value: selectedV1.maxAmountRequired,
      validAfter: (now - 600).toString(),
      // 10 minutes before
      validBefore: (now + selectedV1.maxTimeoutSeconds).toString(),
      nonce
    };
    const signature = await this.signAuthorization(authorization, selectedV1);
    const payload = {
      authorization,
      signature
    };
    return {
      x402Version,
      scheme: selectedV1.scheme,
      network: selectedV1.network,
      payload
    };
  }
  /**
   * Sign the EIP-3009 authorization using EIP-712
   *
   * @param authorization - The authorization to sign
   * @param requirements - The payment requirements
   * @returns Promise resolving to the signature
   */
  async signAuthorization(authorization, requirements) {
    const chainId = getEvmChainIdV1(requirements.network);
    if (!requirements.extra?.name || !requirements.extra?.version) {
      throw new Error(
        `EIP-712 domain parameters (name, version) are required in payment requirements for asset ${requirements.asset}`
      );
    }
    const { name, version } = requirements.extra;
    const domain = {
      name,
      version,
      chainId,
      verifyingContract: getAddress(requirements.asset)
    };
    const message = {
      from: getAddress(authorization.from),
      to: getAddress(authorization.to),
      value: BigInt(authorization.value),
      validAfter: BigInt(authorization.validAfter),
      validBefore: BigInt(authorization.validBefore),
      nonce: authorization.nonce
    };
    return await this.signer.signTypedData({
      domain,
      types: authorizationTypes,
      primaryType: "TransferWithAuthorization",
      message
    });
  }
};

// src/exact/v1/facilitator/scheme.ts
import { getAddress as getAddress3, isAddressEqual as isAddressEqual2, parseErc6492Signature as parseErc6492Signature2 } from "viem";

// src/exact/facilitator/eip3009-utils.ts
import {
  encodeFunctionData,
  getAddress as getAddress2,
  isAddressEqual,
  parseErc6492Signature,
  parseEventLogs,
  parseSignature
} from "viem";
var erc20TransferEventAbi = [
  {
    type: "event",
    name: "Transfer",
    anonymous: false,
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "value", type: "uint256", indexed: false }
    ]
  }
];
async function simulateEip3009Transfer(signer, erc20Address, payload, eip6492Deployment) {
  return (await simulateEip3009TransferResult(signer, erc20Address, payload, eip6492Deployment)).ok;
}
async function simulateEip3009TransferResult(signer, erc20Address, payload, eip6492Deployment) {
  const auth = payload.authorization;
  const transferArgs = [
    getAddress2(auth.from),
    getAddress2(auth.to),
    BigInt(auth.value),
    BigInt(auth.validAfter),
    BigInt(auth.validBefore),
    auth.nonce
  ];
  if (eip6492Deployment) {
    const { signature: innerSignature } = parseErc6492Signature(payload.signature);
    const transferCalldata = encodeFunctionData({
      abi: eip3009ABI,
      functionName: "transferWithAuthorization",
      args: [...transferArgs, innerSignature]
    });
    try {
      const results = await multicall(signer.readContract.bind(signer), [
        {
          address: getAddress2(eip6492Deployment.factoryAddress),
          callData: eip6492Deployment.factoryCalldata
        },
        {
          address: erc20Address,
          callData: transferCalldata
        }
      ]);
      return { ok: results[1]?.status === "success" };
    } catch (error) {
      return { ok: false, error };
    }
  }
  const sig = payload.signature;
  const sigLength = sig.startsWith("0x") ? sig.length - 2 : sig.length;
  const isECDSA = sigLength === 130;
  try {
    if (isECDSA) {
      const parsedSig = parseSignature(sig);
      await signer.readContract({
        address: erc20Address,
        abi: eip3009ABI,
        functionName: "transferWithAuthorization",
        args: [
          ...transferArgs,
          parsedSig.v ?? parsedSig.yParity,
          parsedSig.r,
          parsedSig.s
        ]
      });
    } else {
      await signer.readContract({
        address: erc20Address,
        abi: eip3009ABI,
        functionName: "transferWithAuthorization",
        args: [...transferArgs, sig]
      });
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
async function diagnoseEip3009SimulationFailure(signer, erc20Address, payload, requirements, amountRequired) {
  const payer = payload.authorization.from;
  const diagnosticCalls = [
    {
      address: erc20Address,
      abi: eip3009ABI,
      functionName: "balanceOf",
      args: [payload.authorization.from]
    },
    {
      address: erc20Address,
      abi: eip3009ABI,
      functionName: "name"
    },
    {
      address: erc20Address,
      abi: eip3009ABI,
      functionName: "version"
    },
    {
      address: erc20Address,
      abi: eip3009ABI,
      functionName: "authorizationState",
      args: [payload.authorization.from, payload.authorization.nonce]
    }
  ];
  try {
    const results = await multicall(signer.readContract.bind(signer), diagnosticCalls);
    const [balanceResult, nameResult, versionResult, authStateResult] = results;
    if (authStateResult.status === "failure") {
      return { isValid: false, invalidReason: ErrEip3009NotSupported, payer };
    }
    if (authStateResult.status === "success" && authStateResult.result === true) {
      return { isValid: false, invalidReason: ErrEip3009NonceAlreadyUsed, payer };
    }
    if (nameResult.status === "success" && requirements.extra?.name && nameResult.result !== requirements.extra.name) {
      return { isValid: false, invalidReason: ErrEip3009TokenNameMismatch, payer };
    }
    if (versionResult.status === "success" && requirements.extra?.version && versionResult.result !== requirements.extra.version) {
      return { isValid: false, invalidReason: ErrEip3009TokenVersionMismatch, payer };
    }
    if (balanceResult.status === "success") {
      const balance = balanceResult.result;
      if (balance < BigInt(amountRequired)) {
        return {
          isValid: false,
          invalidReason: ErrEip3009InsufficientBalance,
          payer
        };
      }
    }
  } catch {
  }
  return { isValid: false, invalidReason: ErrEip3009SimulationFailed, payer };
}
function verifyEip3009TransferEvent(logs, erc20Address, expected) {
  const transferLogs = parseEventLogs({
    abi: erc20TransferEventAbi,
    eventName: "Transfer",
    logs: logs.filter((log) => isAddressEqual(log.address, erc20Address))
  });
  return transferLogs.some(
    (log) => isAddressEqual(log.args.from, expected.from) && isAddressEqual(log.args.to, expected.to) && log.args.value === expected.value
  );
}
function parseEip3009TransferError(error) {
  const msg = error instanceof Error ? error.message : String(error);
  if (/authorization.*(expired|valid before)/i.test(msg) || /AuthorizationExpired/i.test(msg)) {
    return ErrValidBeforeExpired;
  }
  if (/authorization.*not.*valid|AuthorizationNotYetValid/i.test(msg)) {
    return ErrValidAfterInFuture;
  }
  if (/authorization.*used|AuthorizationAlreadyUsed|AuthorizationUsedOrCanceled/i.test(msg)) {
    return ErrEip3009NonceAlreadyUsed;
  }
  if (/transfer.*exceeds.*balance|insufficient.*balance|ERC20InsufficientBalance/i.test(msg)) {
    return ErrEip3009InsufficientBalance;
  }
  if (/invalid.*signature|SignerMismatch|InvalidSignatureV|InvalidSignatureS/i.test(msg)) {
    return ErrInvalidSignature;
  }
  return ErrTransactionFailed;
}
async function executeTransferWithAuthorization(signer, erc20Address, payload, dataSuffix) {
  const { signature } = parseErc6492Signature(payload.signature);
  const signatureLength = signature.startsWith("0x") ? signature.length - 2 : signature.length;
  const isECDSA = signatureLength === 130;
  const auth = payload.authorization;
  const baseArgs = [
    getAddress2(auth.from),
    getAddress2(auth.to),
    BigInt(auth.value),
    BigInt(auth.validAfter),
    BigInt(auth.validBefore),
    auth.nonce
  ];
  let signatureArgs;
  if (isECDSA) {
    const parsedSig = parseSignature(signature);
    signatureArgs = [
      parsedSig.v || parsedSig.yParity,
      parsedSig.r,
      parsedSig.s
    ];
  } else {
    signatureArgs = [signature];
  }
  return signer.writeContract({
    address: erc20Address,
    abi: eip3009ABI,
    functionName: "transferWithAuthorization",
    args: [...baseArgs, ...signatureArgs],
    dataSuffix
  });
}

// src/exact/v1/facilitator/scheme.ts
var ExactEvmSchemeV12 = class {
  /**
   * Creates a new ExactEvmFacilitatorV1 instance.
   *
   * @param signer - The EVM signer for facilitator operations
   * @param config - Optional configuration for the facilitator
   */
  constructor(signer, config) {
    this.signer = signer;
    this.scheme = "exact";
    this.caipFamily = "eip155:*";
    this.config = {
      eip6492AllowedFactories: config?.eip6492AllowedFactories ?? [],
      simulateInSettle: config?.simulateInSettle ?? false
    };
  }
  /**
   * Get mechanism-specific extra data for the supported kinds endpoint.
   * For EVM, no extra data is needed.
   *
   * @param _ - The network identifier (unused for EVM)
   * @returns undefined (EVM has no extra data)
   */
  getExtra(_) {
    return void 0;
  }
  /**
   * Get signer addresses used by this facilitator.
   * Returns all addresses this facilitator can use for signing/settling transactions.
   *
   * @param _ - The network identifier (unused for EVM, addresses are network-agnostic)
   * @returns Array of facilitator wallet addresses
   */
  getSigners(_) {
    return [...this.signer.getAddresses()];
  }
  /**
   * Verifies a payment payload (V1).
   *
   * @param payload - The payment payload to verify
   * @param requirements - The payment requirements
   * @returns Promise resolving to verification response
   */
  async verify(payload, requirements) {
    return this._verify(payload, requirements);
  }
  /**
   * Settles a payment by executing the transfer (V1).
   *
   * @param payload - The payment payload to settle
   * @param requirements - The payment requirements
   * @param context - Optional facilitator context for extension capabilities
   * @returns Promise resolving to settlement response
   */
  async settle(payload, requirements, context) {
    const payloadV1 = payload;
    const exactEvmPayload = payload.payload;
    const valid = await this._verify(payload, requirements, {
      simulate: this.config.simulateInSettle ?? false
    });
    if (!valid.isValid) {
      return {
        success: false,
        network: payloadV1.network,
        transaction: "",
        errorReason: valid.invalidReason ?? ErrInvalidScheme,
        payer: exactEvmPayload.authorization.from
      };
    }
    try {
      const { address: factoryAddress, data: factoryCalldata } = parseErc6492Signature2(
        exactEvmPayload.signature
      );
      if (factoryAddress && factoryCalldata && !isAddressEqual2(factoryAddress, "0x0000000000000000000000000000000000000000")) {
        const payerAddress = exactEvmPayload.authorization.from;
        const bytecode = await this.signer.getCode({ address: payerAddress });
        if (!bytecode || bytecode === "0x") {
          const normalizedFactory = factoryAddress.toLowerCase();
          const isAllowed = (this.config.eip6492AllowedFactories ?? []).some(
            (allowed) => allowed.toLowerCase() === normalizedFactory
          );
          if (!isAllowed) {
            return {
              success: false,
              errorReason: ErrFactoryNotAllowed,
              transaction: "",
              network: payloadV1.network,
              payer: exactEvmPayload.authorization.from
            };
          }
          const deployTx = await this.signer.sendTransaction({
            to: factoryAddress,
            data: factoryCalldata
          });
          const deployReceipt = await this.signer.waitForTransactionReceipt({ hash: deployTx });
          if (deployReceipt.status !== "success") {
            return {
              success: false,
              errorReason: ErrSmartWalletDeploymentFailed,
              transaction: "",
              network: payloadV1.network,
              payer: exactEvmPayload.authorization.from
            };
          }
        }
      }
      const dataSuffix = await resolveDataSuffix(context, {
        paymentPayload: payload,
        paymentRequirements: requirements
      });
      const tx = await executeTransferWithAuthorization(
        this.signer,
        getAddress3(requirements.asset),
        exactEvmPayload,
        dataSuffix
      );
      const receipt = await this.signer.waitForTransactionReceipt({ hash: tx });
      if (receipt.status !== "success") {
        return {
          success: false,
          errorReason: ErrTransactionFailed,
          transaction: tx,
          network: payloadV1.network,
          payer: exactEvmPayload.authorization.from
        };
      }
      const auth = exactEvmPayload.authorization;
      if (receipt.logs != null && !verifyEip3009TransferEvent(receipt.logs, getAddress3(requirements.asset), {
        from: getAddress3(auth.from),
        to: getAddress3(auth.to),
        value: BigInt(auth.value)
      })) {
        return {
          success: false,
          errorReason: ErrTransferEventMismatch,
          transaction: tx,
          network: payloadV1.network,
          payer: auth.from
        };
      }
      return {
        success: true,
        transaction: tx,
        network: payloadV1.network,
        payer: exactEvmPayload.authorization.from
      };
    } catch (error) {
      return {
        success: false,
        errorReason: error instanceof Error ? error.message : ErrTransactionFailed,
        transaction: "",
        network: payloadV1.network,
        payer: exactEvmPayload.authorization.from
      };
    }
  }
  /**
   * Internal verify with optional simulation control.
   *
   * @param payload - The payment payload to verify
   * @param requirements - The payment requirements
   * @param options - Verification options (e.g. simulate)
   * @returns Promise resolving to verification response
   */
  async _verify(payload, requirements, options) {
    const requirementsV1 = requirements;
    const payloadV1 = payload;
    const exactEvmPayload = payload.payload;
    const payer = exactEvmPayload.authorization.from;
    let eip6492Deployment;
    if (payloadV1.scheme !== "exact" || requirements.scheme !== "exact") {
      return {
        isValid: false,
        invalidReason: ErrInvalidScheme,
        payer
      };
    }
    let chainId;
    try {
      chainId = getEvmChainIdV1(payloadV1.network);
    } catch {
      return {
        isValid: false,
        invalidReason: ErrNetworkMismatch,
        payer
      };
    }
    if (!requirements.extra?.name || !requirements.extra?.version) {
      return {
        isValid: false,
        invalidReason: ErrMissingEip712Domain,
        payer
      };
    }
    const { name, version } = requirements.extra;
    const erc20Address = getAddress3(requirements.asset);
    if (payloadV1.network !== requirements.network) {
      return {
        isValid: false,
        invalidReason: ErrNetworkMismatch,
        payer
      };
    }
    const permitTypedData = {
      types: authorizationTypes,
      primaryType: "TransferWithAuthorization",
      domain: {
        name,
        version,
        chainId,
        verifyingContract: erc20Address
      },
      message: {
        from: exactEvmPayload.authorization.from,
        to: exactEvmPayload.authorization.to,
        value: BigInt(exactEvmPayload.authorization.value),
        validAfter: BigInt(exactEvmPayload.authorization.validAfter),
        validBefore: BigInt(exactEvmPayload.authorization.validBefore),
        nonce: exactEvmPayload.authorization.nonce
      }
    };
    const signature = exactEvmPayload.signature;
    const {
      isCounterfactual,
      innerSignature,
      eip6492Deployment: classification6492
    } = await classifyErc6492Payer(this.signer, signature, payer);
    if (classification6492) {
      eip6492Deployment = classification6492;
    }
    if (isCounterfactual) {
      const factory = classification6492?.factoryAddress;
      const factoryAllowed = !!factory && this.config.eip6492AllowedFactories.some(
        (a) => a.trim().toLowerCase() === factory.toLowerCase()
      );
      if (!factoryAllowed) {
        return {
          isValid: false,
          invalidReason: ErrFactoryNotAllowed,
          payer
        };
      }
    }
    if (!isCounterfactual) {
      const isValid = await verifyTypedDataSignature(this.signer, {
        address: payer,
        ...permitTypedData,
        signature: innerSignature
      });
      if (!isValid) {
        return {
          isValid: false,
          invalidReason: ErrInvalidSignature,
          payer
        };
      }
    }
    if (getAddress3(exactEvmPayload.authorization.to) !== getAddress3(requirements.payTo)) {
      return {
        isValid: false,
        invalidReason: ErrRecipientMismatch,
        payer
      };
    }
    const now = Math.floor(Date.now() / 1e3);
    if (BigInt(exactEvmPayload.authorization.validBefore) < BigInt(now + 6)) {
      return {
        isValid: false,
        invalidReason: ErrValidBeforeExpired,
        payer
      };
    }
    if (BigInt(exactEvmPayload.authorization.validAfter) > BigInt(now)) {
      return {
        isValid: false,
        invalidReason: ErrValidAfterInFuture,
        payer
      };
    }
    if (BigInt(exactEvmPayload.authorization.value) !== BigInt(requirementsV1.maxAmountRequired)) {
      return {
        isValid: false,
        invalidReason: ErrInvalidAuthorizationValue,
        payer
      };
    }
    if (options?.simulate !== false) {
      const simulationSucceeded = await simulateEip3009Transfer(
        this.signer,
        erc20Address,
        exactEvmPayload,
        eip6492Deployment
      );
      if (!simulationSucceeded) {
        return diagnoseEip3009SimulationFailure(
          this.signer,
          erc20Address,
          exactEvmPayload,
          requirements,
          requirementsV1.maxAmountRequired
        );
      }
    }
    return {
      isValid: true,
      invalidReason: void 0,
      payer
    };
  }
};

export {
  simulateEip3009TransferResult,
  diagnoseEip3009SimulationFailure,
  verifyEip3009TransferEvent,
  parseEip3009TransferError,
  executeTransferWithAuthorization,
  ExactEvmSchemeV12 as ExactEvmSchemeV1,
  ExactEvmSchemeV1 as ExactEvmSchemeV12
};
//# sourceMappingURL=chunk-DBLZWTJ6.mjs.map