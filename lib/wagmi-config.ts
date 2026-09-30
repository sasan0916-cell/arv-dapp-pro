import { http, createConfig } from 'wagmi';
import { bscTestnet, bsc } from 'wagmi/chains';
import { injected } from '@wagmi/core';

export const wagmiConfig = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [injected()],
  transports: {
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
    [bsc.id]: http('https://bsc-dataseed.binance.org/'),
  },
  ssr: true,
});

export const SUPPORTED_CHAINS = [bscTestnet, bsc] as const;
export type SupportedChain = typeof SUPPORTED_CHAINS[number];
