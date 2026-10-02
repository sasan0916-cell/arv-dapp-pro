import { http, createConfig } from 'wagmi';
import { bscTestnet, bsc } from 'wagmi/chains';
import { injected, metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors';

/**
 * External-wallet configuration for ARV Super DApp.
 *
 * The DApp never receives or stores a private key from an external wallet.
 * MetaMask, Trust Wallet, Binance Wallet and other injected wallets sign
 * transactions in their own wallet UI. WalletConnect adds QR/deep-link
 * support for mobile wallets such as Trust Wallet, SafePal and others.
 */
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

const externalConnectors = [
  metaMask(),
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

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: externalConnectors,
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.bnbchain.org:8545'),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  ssr: true,
});

export const SUPPORTED_CHAINS = [bscTestnet, bsc] as const;
export type SupportedChain = typeof SUPPORTED_CHAINS[number];
