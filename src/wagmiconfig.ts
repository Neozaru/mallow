"use client";

import { http, createConfig } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import { mapValues } from 'lodash'
import mallowConfig from './mallow.config'

export const wagmiconfig = createConfig({
  ssr: true,
  chains: mallowConfig.enabledChains,
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
  })
})
