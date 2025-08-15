import stablecoins from '@/constants/stablecoins';
import SettingsService from './settingsService';
import axios, { isAxiosError } from 'axios';
import { createHmac } from 'crypto';
import computeBinanceEffectiveApy from './computeBinanceEffectiveAPY';

const sendRequest = ({ requestPath, queryParams = {}, apiKey, secretKey }) => {
  const allQueryParams = {
    timestamp: `${Date.now()}`,
    recvWindow: `${60000}`,
    ...queryParams
  }
  const queryString = new URLSearchParams(allQueryParams).toString()
  const signature = createHmac('sha256', secretKey)
    .update(queryString)
    .digest('hex')

  const url = `${requestPath}?${queryString}&signature=${signature}`
  return axios.get(url, {
      headers: {
        'X-MBX-APIKEY': apiKey
      },
    })
}

export async function getBinanceBalance(): Promise<YieldPositionExchange[]> {
  const apiKey = SettingsService.getSettings().apiKeys.binanceApiKey
  const secretKey = SettingsService.getSettings().apiKeys.binanceApiSecret
  if (!apiKey || !secretKey) {
    return []
  }

  try {
    const balancesResponse = await sendRequest({
      requestPath: '/api/exchanges/binance/v1/capital/config/getall',
      apiKey,
      secretKey
    })

    const balances = balancesResponse.data
    const spotBalances = balances.filter(
      b => stablecoins.includes(b.coin)
    ).map(b => {
      const formattedBalance = parseFloat(b.free) + parseFloat(b.locked)
      const symbol = b.coin
      return {
        platform: 'binance' as const,
        formattedBalance,
        balanceUnderlying: formattedBalance,
        balanceUsd: formattedBalance,
        symbol,
        poolName: `Spot ${symbol}`,
        type: 'exchange' as const,
        apy: 0,
        isSpot: true
      }
    })

    const earnResponse = await sendRequest({
      requestPath: '/api/exchanges/binance/v1/simple-earn/flexible/position',
      queryParams: { size: 100 },
      apiKey,
      secretKey
    })
    const flexEarnPositions = earnResponse.data
    const earnBalances = flexEarnPositions.rows.filter(
      b => stablecoins.includes(b.asset)
    ).map(b => {
      const formattedBalance = parseFloat(b.totalAmount)
      const symbol = b.asset
      const apy = computeBinanceEffectiveApy(b)
      return {
        platform: 'binance' as const,
        formattedBalance,
        balanceUnderlying: formattedBalance,
        balanceUsd: formattedBalance,
        symbol,
        poolName: `Flex Earn ${symbol}`,
        type: 'exchange' as const,
        apy
      }
    })

    return [...spotBalances, ...earnBalances]
  } catch (error) {
    console.error('Error fetching balances:', isAxiosError(error) && error.response?.data || error)
    return []
  }
}
