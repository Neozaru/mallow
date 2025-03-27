import { http } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mapValues } from 'lodash'
import mallowConfig from './mallow.config'

export const wagmiconfig = getDefaultConfig({
  ssr: true,
  chains: mallowConfig.enabledChains,
  appName: 'Mallow',
  projectId: `${process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID}`,
  transports: mapValues(mallowConfig.chains, ({ rpcUrl }) => {
    return http(rpcUrl)
  })
})
