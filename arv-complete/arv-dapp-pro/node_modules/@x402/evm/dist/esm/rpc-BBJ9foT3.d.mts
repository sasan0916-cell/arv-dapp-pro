type EvmSchemeConfig = {
    rpcUrl?: string;
};
type EvmSchemeConfigByChainId = Record<number, EvmSchemeConfig>;
type EvmSchemeOptions = EvmSchemeConfig | EvmSchemeConfigByChainId;
/** @deprecated Use EvmSchemeConfig */
type ExactEvmSchemeConfig = EvmSchemeConfig;
/** @deprecated Use EvmSchemeConfigByChainId */
type ExactEvmSchemeConfigByChainId = EvmSchemeConfigByChainId;
/** @deprecated Use EvmSchemeOptions */
type ExactEvmSchemeOptions = EvmSchemeOptions;

export type { EvmSchemeOptions as E, ExactEvmSchemeConfig as a, ExactEvmSchemeConfigByChainId as b, ExactEvmSchemeOptions as c, EvmSchemeConfig as d, EvmSchemeConfigByChainId as e };
