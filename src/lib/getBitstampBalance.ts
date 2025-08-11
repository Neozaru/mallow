import stablecoins from '@/constants/stablecoins';
import SettingsService from './settingsService';
import axios, { isAxiosError } from 'axios';
import { createHmac, randomBytes } from 'crypto';
import bitstampHeaders from '@/utils/bitstampHeaders';

const API_PATH = 'api/v2'

const sendBitstampApiRequest = ({endpoint, method, apiKey, secretKey }) => {
  
  const headers = {
    [bitstampHeaders.AUTH]: `BITSTAMP ${apiKey}`,
    [bitstampHeaders.NONCE]: randomBytes(18).toString('hex'),
    [bitstampHeaders.TIMESTAMP]: `${Date.now()}`,
    [bitstampHeaders.VERSION]: 'v2',
  }
  
  const reqParams = {
    headers,
    method
  }
  
  const signature = generateSignature({
    reqUrl: endpoint,
    reqParams,
    apiKey,
    secretKey
  })
  
  const requestPathProxy = `/api/exchanges/bitstamp/${endpoint}`
  const axiosParams = {
    method,
    url: requestPathProxy,
    headers: {
      ...headers,
      [bitstampHeaders.SIGNATURE]: signature
    }
  }
  return axios(axiosParams)
}

const generateSignature = ({
  reqUrl,
  reqParams,
  apiKey,
  secretKey
}) => {
  const { headers, method } = reqParams
  const message = `BITSTAMP ${apiKey}${method}www.bitstamp.net/${reqUrl}/${reqParams?.query || ''}${headers[bitstampHeaders.NONCE]}${headers[bitstampHeaders.TIMESTAMP]}${headers[bitstampHeaders.VERSION]}${reqParams?.body || ''}`
  const signature = createHmac('sha256', secretKey)
    .update(message, 'utf8')
    .digest('hex')
  return signature
}

const fetchSpotBalances = async ({ apiKey, secretKey }) => {
  try {
    const response = await sendBitstampApiRequest({
      endpoint: `${API_PATH}/account_balances`,
      method: 'POST',
      apiKey,
      secretKey
    })

    const balances = response.data
    return balances.filter(
      b => stablecoins.map(s => s.toLocaleLowerCase()).includes(b.currency)
    ).map(b => {
      const formattedBalance = parseFloat(b.total)
      const symbol = b.currency.toLocaleUpperCase()
      return {
        platform: 'bitstamp' as const,
        formattedBalance,
        balanceUsd: formattedBalance,
        symbol,
        poolName: `Spot ${symbol}`,
        type: 'exchange' as const,
        apy: 0,
        isSpot: true
      }
    })
  } catch (error) {
    console.error('Error fetching spot BITSTAMP balances:', error)
    return []
  }
}

const fetchEarnBalances = async ({ apiKey, secretKey }) => {
  try {
    const response = await sendBitstampApiRequest({
      endpoint: `${API_PATH}/earn/subscriptions`,
      method: 'GET',
      apiKey,
      secretKey
    })

    const balances = response.data
    return balances.filter(
      b => stablecoins.includes(b.currency)
    ).map(b => {
      const formattedBalance = parseFloat(b.amount)
      const symbol = b.currency.toLocaleUpperCase()
      const apy = b.estimated_annual_yield / 100
      return {
        platform: 'bitstamp' as const,
        formattedBalance,
        balanceUsd: formattedBalance,
        symbol,
        poolName: `Earn ${symbol}`,
        type: 'exchange' as const,
        apy,
        isSpot: true
      }
    })
  } catch (error) {
    console.error('Error fetching earn BITSTAMP balances:', error)
    console.error('Error fetching earn balances:', isAxiosError(error) && error.response?.data || error)
    return []
  }
}

export async function getBitstampBalance(): Promise<YieldPositionExchange[]> {
  const apiKey = SettingsService.getSettings().apiKeys.bitstampApiKey
  const secretKey = SettingsService.getSettings().apiKeys.bitstampApiSecret
  if (!apiKey || !secretKey) {
    return []
  }

  const spotBalances = await fetchSpotBalances({ apiKey, secretKey })
  const earnBalances = await fetchEarnBalances({ apiKey, secretKey })

  return [
    ...spotBalances,
    ...earnBalances
  ]

}
