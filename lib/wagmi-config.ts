import { http, createConfig } from 'wagmi';
import { bscTestnet, bsc } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'ARV DApp' }),
  ],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
    [bsc.id]: http('https://bsc-dataseed.binance.org/'),
  },
  ssr: true,
});

export const SUPPORTED_CHAINS = [bscTestnet, bsc] as const;
export type SupportedChain = typeof SUPPORTED_CHAINS[number];
