"use client";

import { http, createConfig } from 'wagmi'
import { arbitrum, base, gnosis, mainnet, optimism, scroll, zksync, polygon } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'
import mallowConfig from './mallow.config';
import { mapValues } from 'lodash';

export const wagmiconfig = createConfig({
  ssr: true,
  chains: [mainnet, optimism, arbitrum, scroll, base, zksync, gnosis, polygon],
  connectors: [
    injected(),
    walletConnect({
      disableProviderPing: true,
      customStoragePrefix: 'wagmiWC',
      projectId: `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`,
      showQrModal: false,
      metadata: { 
        name: 'Mallow', 
        description: 'Do (s)more with your stablecoins', 
        url: 'https://mallow.money/',
        icons: ['https://mallow.money/mallowLogoRound.svg'],
      }, 
    }),
  ],
  transports: mapValues(mallowConfig.chains, ({ rpcUrl }) => {
    return http(rpcUrl)
  }),
})
