"use client";

import DashboardComponent from '@/components/DashboardComponent';
import { wagmiconfig } from '@/wagmiconfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient()

export default function DashboardPageWithoutAddress() {
  return (<WagmiProvider config={wagmiconfig}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider theme="midnight">
        <DashboardComponent/>
      </ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>)
}
