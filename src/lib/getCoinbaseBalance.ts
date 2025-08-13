import stablecoins from '@/constants/stablecoins';
import { sign } from 'jsonwebtoken'
import SettingsService from './settingsService';
import axios, { isAxiosError } from 'axios';
import { randomBytes } from 'crypto';

async function coinbaseApiGet(endpoint: string) {
  const keyName = SettingsService.getSettings().apiKeys.coinbaseKeyName
  const apiSecret = SettingsService.getSettings().apiKeys.coinbaseApiSecret

  const request_method = 'GET';
  const url = 'api.coinbase.com';
  const request_path = `/api/v3/brokerage/${endpoint}`;

  const algorithm = 'ES256';
  const uri = request_method + ' ' + url + request_path;

  const token = sign(
    {
      iss: 'cdp',
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: keyName,
      uri,
    },
    apiSecret,
    {
      algorithm,
      header: {
        kid: keyName,
        nonce: randomBytes(16).toString('hex'),
      },
    }
  )
  const requestPath = `/api/exchanges/coinbase/${endpoint}`
  const headers = {
    'authorization': `Bearer ${token}`
  }
  return axios.get(requestPath, { headers })
}

export async function getCoinbaseBalance(): Promise<YieldPositionExchange[]> {
  try {
    const responsePortfolios = await coinbaseApiGet('portfolios')
    const portfolioUuid = responsePortfolios.data.portfolios[0].uuid
    const responseAccount = await coinbaseApiGet(`portfolios/${portfolioUuid}`)
    return responseAccount.data.breakdown.spot_positions
    .filter(pos => stablecoins.includes(pos.asset))
    .map(pos => {
      const symbol = pos.asset
      return {
        platform: 'coinbase' as const,
        formattedBalance: pos.total_balance_crypto,
        balanceUnderlying: Number(pos.total_balance_fiat),
        balanceUsd: Number(pos.total_balance_fiat),
        symbol,
        poolName: `Spot ${symbol}`,
        type: 'exchange' as const,
        apy: 0,
        isSpot: true
      }
    })
  } catch (error) {
    console.error('Error fetching portfolios:', isAxiosError(error) && error.response?.data || error)
    return []
  }
}
