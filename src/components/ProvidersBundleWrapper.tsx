'use client';

import getQueryClient from '@/lib/getQueryClient';
import { wagmiconfig } from '@/wagmiconfig';
import { QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

const queryClient = getQueryClient()

export default function ProvidersBundleWrapper({ children }) {
  return (
  <WagmiProvider config={wagmiconfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
  )
}
