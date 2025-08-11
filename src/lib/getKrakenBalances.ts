import stablecoins from '@/constants/stablecoins';
import axios, { AxiosRequestConfig } from 'axios';
import SettingsService from './settingsService';
import { createHash, createHmac } from 'crypto';
import { stringify } from 'querystring';
import getNewNonce from './getNewNonce';

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

type KrakenResponse = {
  error: unknown[];
  result: { [symbol: string]: string };
}

const stablecoinSavings = {
  M: {
    poolName: 'Flexible',
    apy: 0.0425
  },
  B: {
    poolName: 'Bonded',
    apy: 0.055
  }
}

const getStablecoinPoolNameAndApy = (typeLetter: string | undefined) => {
  const savingsProps = typeLetter && stablecoinSavings[typeLetter]
  if (!savingsProps) {
    return {
      poolName: 'Spot',
      apy: 0
    }
  }
  return savingsProps 
}

export async function getKrakenBalances(): Promise<YieldPositionExchange[]> {
  const apiKey = SettingsService.getSettings().apiKeys.krakenApiKey
  const apiSecret = SettingsService.getSettings().apiKeys.krakenApiSecret
  if (!apiKey || !apiSecret) {
    return []
  }
  const endpoint = '/0/private/Balance'
  const payload = {
    nonce: getNewNonce()
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
      throw new Error(JSON.stringify(response.data.error))
    }
    const stablecoinsWithSuffixes = [
      ...stablecoins,
      ...stablecoins.flatMap(symbol => [`${symbol}.F`, `${symbol}.M`, `${symbol}.B`])
    ]
    const balances: { symbol: string, balance: bigint, poolName: string, apy: number }[] = []
    Object.entries(response.data.result)
      .map(([asset, balance]) => {
        if (!stablecoinsWithSuffixes.includes(asset)) {
          return
        }
        const balanceBn = BigInt(parseInt(balance))
        if (balanceBn <= 0) {
          return
        }
        const [symbol, afterDot] = asset.split('.')
        const { apy, poolName } = getStablecoinPoolNameAndApy(afterDot)
        balances.push({
          symbol,
          balance: balanceBn,
          poolName,
          apy
        })
    })
    const krakenBalances: YieldPositionExchange[] = balances.map(({symbol, balance, poolName, apy}, i): YieldPositionExchange => {
      return {
        id: `kraken-${i}`,
        platform: 'kraken' as const,
        symbol,
        balance,
        poolName,
        formattedBalance: `${balance}`,
        balanceUsd: Number(balance),
        type: 'exchange' as const,
        apy,
        isSpot: apy === 0
      }
    })
    return krakenBalances
  } catch (error) {
    console.error('getKrakenBalances: error', error)
    return []
  }
}
