import stablecoins from '@/constants/stablecoins';
import SettingsService from './settingsService';
import axios from 'axios';
import { createHmac } from 'crypto';

export async function getBinanceBalance(): Promise<YieldPositionExchange[]> {
  const apiKey = SettingsService.getSettings().apiKeys.binanceApiKey
  const secretKey = SettingsService.getSettings().apiKeys.binanceApiSecret
  if (!apiKey || !secretKey) {
    return []
  }
  const requestPath = '/api/exchanges/binance/v1/capital/config/getall';
  
  const timestamp = Date.now(); // Get current timestamp
  const queryString = `timestamp=${timestamp}&recvWindow=60000`; // API request parameters
  const signature = createHmac('sha256', secretKey)
    .update(queryString)
    .digest('hex'); // Sign the request

  const url = `${requestPath}?${queryString}&signature=${signature}`
  try {
    // Send the request to Binance API
    const response = await axios.get(url, {
      headers: {
        'X-MBX-APIKEY': apiKey, // Add API key in header
      },
    });

    const balances = response.data; // Account balances array

    return balances.filter(
      b => stablecoins.includes(b.coin)
    ).map(b => {
      const formattedBalance = parseFloat(b.free) + parseFloat(b.locked)
      const symbol = b.coin
      return {
        protocol: 'binance' as const,
        formattedBalance,
        balanceUsd: formattedBalance,
        symbol,
        poolName: `Spot ${symbol}`,
        type: 'exchange' as const,
        apy: 0
      }
    })
  } catch (error) {
    console.error('Error fetching balances:', error.response?.data || error.message)
    return []
  }
}
