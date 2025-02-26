'use client';

import getQueryClient from '@/lib/getQueryClient';
import { wagmiconfig } from '@/wagmiconfig';
import { QueryClientProvider } from '@tanstack/react-query';
import { AaveContractsProvider } from 'aave-v3-react';
import { WagmiProvider } from 'wagmi';

const queryClient = getQueryClient()

export default function ProvidersBundleWrapper({ children }) {
  return (
  <WagmiProvider config={wagmiconfig}>
      <AaveContractsProvider>
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
      </AaveContractsProvider>
  </WagmiProvider>
  )
}
