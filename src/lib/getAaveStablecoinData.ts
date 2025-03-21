import { axiosGetCached } from './axiosGetCached'

const SECONDS_PER_YEAR = 31536000; // Number of seconds in a year

type AaveRatesHistoryPoint = {
  liquidityRate_avg: number;
}

type AaveRatesHistory = AaveRatesHistoryPoint[]

type AaveAssetData = {
  underlyingAsset: string;
  symbol: string;
  isActive: boolean;
  isFreezed: boolean;
  borrowingEnabled: boolean;
  stableBorrowRateEnabled: boolean;
  variableBorrowRate: string;
  stableBorrowRate: string;
  liquidityRate: string;
  totalLiquidity: string;
  lastUpdateTimestamp: number;
  aTokenAddress: string;
  totalBorrows: string;
  totalLiquidityUSD: string;
  id: string;
  totalBorrowsUSD: string;
  interestPerSecond: string;
}

type AaveMarketData = {
  reserves: AaveAssetData[];
}

export async function getAaveStablecoinData(symbols: string[], chainIds: number[]) {
  const { data } = await axiosGetCached<AaveMarketData>('https://aave-api-v2.aave.com/data/markets-data', 3600000)
  const dataForStablecoins = await Promise.all(data.reserves.map(r => ({
    ...r,
    chainId: r.id.startsWith('0x') ? 1 : parseInt(r.id.split('-')[0])
  })).filter(({ symbol, chainId }) =>
    symbols.includes(symbol) &&
    chainIds.includes(chainId)
  ).map(async r => {
    if (!r.id) {
      return {
        ...r,
        apy: 0
      }
    }
    let poolIdRateHistory
    if (r.id.includes('-')) {
      const [chainId, assetAddress, poolAddress] = r.id.split('-')
      poolIdRateHistory = `${assetAddress}${poolAddress}${chainId}`
    } else {
      poolIdRateHistory = `${r.id}`
    }
    const fromDateSecs = Math.floor((Date.now() / 1000 - 3600))
    const rateUrl = `https://aave-api-v2.aave.com/data/rates-history?reserveId=${poolIdRateHistory}&from=${fromDateSecs}&resolutionInHours=1`

    const { data: poolRateHistory } = await axiosGetCached<AaveRatesHistory>(rateUrl)

    const apr = poolRateHistory && poolRateHistory.length > 0
      ? poolRateHistory[poolRateHistory.length - 1].liquidityRate_avg
      : 0

    const apy = Math.pow(1 + apr / SECONDS_PER_YEAR, SECONDS_PER_YEAR) - 1;
    return {
      ...r,
      apy
    }
  }))
  return dataForStablecoins
} 
