import stablecoins from '@/constants/stablecoins';
import SettingsService from './settingsService';
import axios, { isAxiosError } from 'axios';
import { createHmac } from 'crypto';

export async function getBinanceBalance(): Promise<YieldPositionExchange[]> {
  const apiKey = SettingsService.getSettings().apiKeys.binanceApiKey
  const secretKey = SettingsService.getSettings().apiKeys.binanceApiSecret
  if (!apiKey || !secretKey) {
    return []
  }
  const requestPath = '/api/exchanges/binance/v1/capital/config/getall';
  
  const timestamp = Date.now()
  const queryString = `timestamp=${timestamp}&recvWindow=60000`
  const signature = createHmac('sha256', secretKey)
    .update(queryString)
    .digest('hex')

  const url = `${requestPath}?${queryString}&signature=${signature}`
  try {
    const response = await axios.get(url, {
      headers: {
        'X-MBX-APIKEY': apiKey
      },
    })

    const balances = response.data
    return balances.filter(
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
  } catch (error) {
    console.error('Error fetching balances:', isAxiosError(error) && error.response?.data || error)
    return []
  }
}
