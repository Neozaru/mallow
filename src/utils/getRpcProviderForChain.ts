import mallowConfig from '@/mallow.config'
import { ethers } from 'ethers'
import { memoize } from 'lodash'


const getRpcProviderForChain = memoize(chainId => {
  const chainConfig = mallowConfig.chains[chainId]
  if (!chainConfig) {
    throw new Error(`No config for chain ${chainId}`)
  }
  return new ethers.providers.JsonRpcProvider(
    chainConfig.rpcUrl
  )
})

export default getRpcProviderForChain
