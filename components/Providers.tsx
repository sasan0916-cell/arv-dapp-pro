'use client';

import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/lib/wagmi-config';

import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const arvTheme = {
  ...darkTheme({
    accentColor: '#d4af37',
    accentColorForeground: '#0a1929',
    borderRadius: 'medium',
    fontStack: 'system',
  }),
  colors: {
    ...darkTheme().colors,
    modalBackground: '#0a1929',
    modalBorder: '#1e3a5f',
    profileForeground: '#0a1929',
    menuItemBackground: '#1e3a5f',
  },
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={arvTheme} locale="fa" modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
