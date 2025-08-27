import { http } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mapValues } from 'lodash'
import mallowConfig from './mallow.config'
import { env } from 'next-runtime-env';

const transports = mapValues(mallowConfig.chains, ({ rpcUrl }) => {
  return http(`${rpcUrl}`)
})

export const wagmiconfig = getDefaultConfig({
  ssr: true,
  chains: mallowConfig.enabledChains,
  appName: 'Mallow',
  projectId: `${env('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')}`,
  transports
})
