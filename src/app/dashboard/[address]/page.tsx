"use client";

import DashboardComponent from '@/components/DashboardComponent';
import getQueryClient from '@/lib/getQueryClient';
import { wagmiconfig } from '@/wagmiconfig';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { WagmiProvider } from 'wagmi';

const queryClient = getQueryClient()

export default function DashboardPageWithAddress() {
  return (<WagmiProvider config={wagmiconfig}>
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider theme="midnight">
        <DashboardComponent/>
      </ConnectKitProvider>
    </QueryClientProvider>
  </WagmiProvider>)
}
