import { UiPoolDataProvider } from '@aave/contract-helpers';
import * as markets from '@bgd-labs/aave-address-book';
import { arbitrum, avalanche, base, bsc, gnosis, mainnet, metis, optimism, plasma, polygon, scroll, sonic, zksync } from 'viem/chains';
import getRpcProviderForChain from '@/utils/getRpcProviderForChain';

// TODO: Is there a better to map them ? This is harder to maintain.
const marketsPerChain = {
  [mainnet.id]: markets.AaveV3Ethereum,
  [optimism.id]: markets.AaveV3Optimism,
  [arbitrum.id]: markets.AaveV3Arbitrum,
  [scroll.id]: markets.AaveV3Scroll,
  [base.id]: markets.AaveV3Base,
  [zksync.id]: markets.AaveV3ZkSync,
  [polygon.id]: markets.AaveV3Polygon,
  [gnosis.id]: markets.AaveV3Gnosis,
  [avalanche.id]: markets.AaveV3Avalanche,
  [bsc.id]: markets.AaveV3BNB,
  [metis.id]: markets.AaveV3Metis,
  [sonic.id]: markets.AaveV3Sonic,
  [plasma.id]: markets.AaveV3Plasma,
}

const getAaveReservesForChain = async chainId => {
  const market = marketsPerChain[chainId]
  if (!market) {
    console.warn(`No Aave market set for chain ${chainId}`)
    return []
  }
  const provider = getRpcProviderForChain(chainId)

  const poolDataProviderContract = new UiPoolDataProvider({
    uiPoolDataProviderAddress: market.UI_POOL_DATA_PROVIDER,
    provider,
    chainId,
  })
  const reserves = await poolDataProviderContract.getReservesHumanized({
    lendingPoolAddressProvider: market.POOL_ADDRESSES_PROVIDER,
  })
  return reserves.reservesData
}

const getAaveReserves = async ({ symbols, chainIds }) => {
  const reserves = await Promise.all(chainIds.map(getAaveReservesForChain))
  // TODO: Generalized symbols match
  return reserves.flat().filter(a => symbols.map(s => s.toLowerCase()).includes(a.symbol.toLowerCase()))
}

export default getAaveReserves