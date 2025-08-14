import { flatten, map } from 'lodash';
import { axiosGetCached } from './axiosGetCached'

type PendleAssetInfo = {
  name: string;
  address: string;
  expiry: Date;
  pt: string;
  yt: string;
  sy: string;
  underlyingAsset: string;
}

type PendleMarketsResponse = {
  markets: PendleAssetInfo[]
}

type PendleAssetRates = {
  underlyingToken: string;
  underlyingTokenToPtRate: number;
  ptToUnderlyingTokenRate: number;
  underlyingTokenToYtRate: number;
  ytToUnderlyingTokenRate: number;
  impliedApy: number;
}

const getPendleAssetsForChain = async ({ marketNames, chainId }) => {
  try {
    const { data: activeMarkets } = await axiosGetCached<PendleMarketsResponse>(`https://api-v2.pendle.finance/core/v1/${chainId}/markets/active`)
    const { data: inactiveMarkets } = await axiosGetCached<PendleMarketsResponse>(`https://api-v2.pendle.finance/core/v1/${chainId}/markets/inactive`)

    const activeStablecoinMarkets = activeMarkets.markets.filter(market => marketNames.includes(market.name))
    const inactiveStablecoinMarkets = inactiveMarkets.markets.filter(market => marketNames.includes(market.name))
    if (activeStablecoinMarkets.length === 0 && inactiveStablecoinMarkets.length === 0) {
      return []
    }
    
    const marketRatesPromises = map(activeStablecoinMarkets, 'address').map(marketAddress => {
      return axiosGetCached<PendleAssetRates>(`https://api-v2.pendle.finance/core/v1/sdk/${chainId}/markets/${marketAddress}/swapping-prices`)
    })
    const marketRatesResult = await Promise.all(marketRatesPromises)
    const marketRates = map(marketRatesResult, 'data')
    
    const dataForActive = activeStablecoinMarkets.map((market, i) => ({
      isActive: true,
      info: market,
      rates: marketRates[i],
      chainId
    }))
    const dataForInactive = inactiveStablecoinMarkets.map(market => ({
      isActive: false,
      info: market,
      chainId
    }))
    return [...dataForActive, ...dataForInactive]
  } catch (e) {
    console.warn(`Error while fetching Pendle opportunities for chain ${chainId}`, e)
    return []
  }
}

type Props = {
  symbols: string[];
  chainIds: number[];
}
const getPendleAssets = async ({ symbols, chainIds }: Props) => {
  const marketNames = symbols.flatMap(symbol => [symbol, `a${symbol}`, `${symbol} Rewards`])
  const pendleAssets = await Promise.all(
    chainIds.map(chainId => getPendleAssetsForChain({ marketNames, chainId }))
  )
  return flatten(pendleAssets)
}

export default getPendleAssets
