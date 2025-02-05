import stablecoins from '@/constants/stablecoins';
import axios, { AxiosRequestConfig } from 'axios';
import SettingsService from './settingsService';
import { createHash, createHmac } from 'crypto';
import { stringify } from 'querystring';

class RequestQueue {
  private queue: Promise<void> = Promise.resolve();

  add<T>(requestFn: () => Promise<T>): Promise<T> {
    const result = this.queue.then(() => requestFn());
    this.queue = result.then(() => undefined);
    return result;
  }
}

// Create a global instance of the queue
const requestQueue = new RequestQueue()

const postWithQueue = (url: string, data, extra: AxiosRequestConfig) => {
  return requestQueue.add(() => axios.post<KrakenResponse>(url, data, extra))
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

type KrakenResponse = {
  error?: any;
  result: { [symbol: string]: string };
}

export async function getKrakenBalances(): Promise<YieldPositionExchange[]> {
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
    const balances: { symbol: string, balance: bigint, poolName: string, apy: number }[] = []
    Object.entries(response.data.result)
      .map(([asset, balance]) => {
        if (!stablecoinsWithSuffixes.includes(asset)) {
          return
        }
        const [symbol, afterDot] = asset.split('.')
        const balanceBn = BigInt(parseInt(balance))
        if (balanceBn <= 0) {
          return
        }
        balances.push({
          symbol,
          balance: balanceBn,
          poolName: afterDot === 'M' ? 'Kraken Savings' : `Spot ${symbol}`,
          apy: afterDot === 'M' ? 0.04 : 0,
        })
    })
    const krakenBalances: YieldPositionExchange[] = balances.map(({symbol, balance, poolName, apy}, i): YieldPositionExchange => {
      return {
        id: `kraken-${i}`,
        protocol: 'kraken' as const,
        symbol,
        balance,
        poolName,
        formattedBalance: `${balance}`,
        balanceUsd: Number(balance),
        type: 'exchange' as const,
        apy
      }
    })
    return krakenBalances
  } catch (error) {
    console.error('getKrakenBalances: error', error)
    return []
  }
}
