import { http, createConfig, fallback } from 'wagmi';
import { bscTestnet, bsc } from 'wagmi/chains';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

/**
 * External-wallet configuration for ARV Super DApp.
 *
 * The DApp never receives or stores a private key from an external wallet.
 * MetaMask, Trust Wallet, Binance Wallet and other injected wallets sign
 * transactions in their own wallet UI. WalletConnect adds QR/deep-link
 * support for mobile wallets such as Trust Wallet, SafePal and others.
 *
 * RPC Fallback: Multiple RPC endpoints per chain for reliability.
 */
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

const externalConnectors = [
  coinbaseWallet({ appName: 'ARV Super DApp' }),
  injected({ shimDisconnect: true }),
  ...(walletConnectProjectId
    ? [
        walletConnect({
          projectId: walletConnectProjectId,
          showQrModal: true,
          metadata: {
            name: 'ARV Super DApp',
            description: 'Independent decentralized exchange on BNB Smart Chain',
            url: 'https://arvtoken.ir',
            icons: ['https://arvtoken.ir/arv-logo.png'],
          },
        }),
      ]
    : []),
];

// 🛡️ RPC Fallback endpoints — اگر اولی قطع بود، خودکار به بعدی وصل می‌شه
const BSC_TESTNET_RPCS = [
  'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
  'https://data-seed-prebsc-2-s1.bnbchain.org:8545',
  'https://data-seed-prebsc-1-s2.bnbchain.org:8545',
  'https://bsc-testnet.public.blastapi.io',
  'https://bsc-testnet-rpc.publicnode.com',
];

const BSC_MAINNET_RPCS = [
  'https://bsc-dataseed.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc.publicnode.com',
  'https://bsc-rpc.publicnode.com',
];

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: externalConnectors,
  transports: {
    [bscTestnet.id]: fallback(
      BSC_TESTNET_RPCS.map((url) => http(url, { timeout: 10_000 })),
      { rank: false }
    ),
    [bsc.id]: fallback(
      BSC_MAINNET_RPCS.map((url) => http(url, { timeout: 10_000 })),
      { rank: false }
    ),
  },
  ssr: true,
});

export const SUPPORTED_CHAINS = [bscTestnet, bsc] as const;
export type SupportedChain = typeof SUPPORTED_CHAINS[number];

// 📤 Export RPC lists for debugging
export { BSC_TESTNET_RPCS, BSC_MAINNET_RPCS };
