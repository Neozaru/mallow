import stablecoins from '@/constants/stablecoins';
import axios, { AxiosResponse } from 'axios';
import SettingsService from './settingsService';
import { createHash, createHmac } from 'crypto';
import { stringify } from 'querystring';

class RequestQueue {
  private queue: Promise<void> = Promise.resolve()

  /**
   * Add a request function to the queue.
   * @param requestFn - A function that returns a Promise for the request.
   * @returns A Promise that resolves with the result of the request.
   */
  add<T>(requestFn: () => Promise<T>): Promise<T> {
    this.queue = this.queue.then(() => requestFn())
    return this.queue as Promise<T>
  }
}

// Create a global instance of the queue
const requestQueue = new RequestQueue()

const postWithQueue = <T = any>(url: string, data: any, extra: any = null): Promise<AxiosResponse<T>> => {
  return requestQueue.add(() => axios.post<T>(url, data, extra))
}

function getKrakenSignature(endpoint, data, secret) {
  let encoded;
  if (typeof data === 'string') {
    const jsonData = JSON.parse(data);
    encoded = jsonData.nonce + data;
  } else if (typeof data === 'object') {
    const dataStr = stringify(data);
    encoded = data.nonce + dataStr;
  } else {
    throw new Error('Invalid data type');
  }
  const sha256Hash = createHash('sha256').update(encoded).digest();
  const message = endpoint + sha256Hash.toString('binary');
  const hmac = createHmac('sha512', Buffer.from(secret, 'base64'));
  hmac.update(message, 'binary');
  const signature = hmac.digest('base64');
  return signature;
}

let nonce = Math.floor(Date.now() / 1000)

export const getNonce = () => {
  const currentNonce = nonce
  nonce += 1
  return currentNonce
};

export async function getKrakenBalances(): Promise<YieldPosition[]> {
  const apiKey = SettingsService.getSettings().apiKeys.krakenApiKey
  const apiSecret = SettingsService.getSettings().apiKeys.krakenApiSecret
  if (!apiKey || !apiSecret) {
    return []
  }
  const endpoint = '/0/private/Balance'
  const payload = {
    nonce: getNonce()
  }
  const signature = getKrakenSignature(endpoint, payload, apiSecret)
  const headers = {
    'api-key': apiKey,
    'api-sign': signature
  }
  try {
    // Send the request to Binance API
    const response = await postWithQueue(`/api/exchanges/kraken${endpoint}`, payload, { headers })
    if (response.data.error.length > 0) {
      throw new Error(response.data.error)
    }
    const stablecoinsWithSuffixes = [
      ...stablecoins,
      ...stablecoins.flatMap(symbol => [`${symbol}.F`, `${symbol}.M`])
    ]
    let balances = []
    Object.entries(response.data.result)
      .map(([asset, balance]) => {
        if (!stablecoinsWithSuffixes.includes(asset)) {
          return
        }
        const [symbol, afterDot] = asset.split('.')
        const balanceFloat = parseFloat(balance)
        if (balanceFloat <= 0) {
          return
        }
        balances.push({
          symbol,
          balance: balanceFloat,
          poolName: afterDot === 'M' ? 'Kraken Savings' : `Spot ${symbol}`,
          apy: afterDot === 'M' ? 0.04 : 0,
        })
    })
    const krakenBalances: YieldPosition[] = balances.map(({symbol, balance, poolName, apy}) => {
      return {
        protocol: 'kraken',
        symbol,
        balance,
        poolName,
        formattedBalance: balance,
        balanceUsd: balance,
        type: 'exchange',
        apy
      }
    })
    return krakenBalances
  } catch (error) {
    console.error('getKrakenBalances: error', error)
    return []
  }
}
