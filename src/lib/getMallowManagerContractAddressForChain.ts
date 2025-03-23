import mallowConfig from '@/mallow.config';
import { memoize } from 'lodash';

const getMallowManagerContractAddressForChain = memoize(chainId => {
  const addresses = mallowConfig.mallowContractAddresses[chainId]
  if (!addresses) {
    console.warn(`No mallow contract addresses for chain ${chainId}`)
    return
  }
  return addresses.manager
})

export default getMallowManagerContractAddressForChain
