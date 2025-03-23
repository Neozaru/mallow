import stablecoinAddresses from '@/constants/stablecoinAddresses'
import { find, memoize } from 'lodash'

const getStablecoinAddress = memoize(({ symbol, chainId }: { symbol: string, chainId: number }) => {
  const stablecoinAddressesPerChain = find(stablecoinAddresses, { symbol: symbol })
  if (!stablecoinAddressesPerChain) {
    throw Error(`Can't find stablecoin for ${symbol}`)
  }
  const stablecoinAddress = stablecoinAddressesPerChain.addresses[chainId]
  if (!stablecoinAddress) {
    throw Error(`Can't find stablecoin address for ${symbol} on chain ${chainId}`)
  }
  return stablecoinAddress
})

export default getStablecoinAddress
