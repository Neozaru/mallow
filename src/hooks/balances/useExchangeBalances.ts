import { getBinanceBalance } from '@/lib/getBinanceBalance'
import { getBitstampBalance } from '@/lib/getBitstampBalance'
import { getCoinbaseBalance } from '@/lib/getCoinbaseBalance'
import { getKrakenBalances } from '@/lib/getKrakenBalances'
import SettingsService from '@/lib/settingsService'
import useStable from '@/utils/useStable'
import { useQueries } from '@tanstack/react-query'
import { flatMap, identity, some } from 'lodash'
import { useMemo } from 'react'

const useExchangeBalances = (enabled: boolean): LoadableData<YieldPositionExchange[]> => {
  const results = useQueries({
    queries: [
      {
        queryKey: ['coinbase'],
        queryFn: getCoinbaseBalance,
        staleTime: Infinity,
        enabled: enabled && !!SettingsService.getSettings().apiKeys.coinbaseKeyName && !!SettingsService.getSettings().apiKeys.coinbaseApiSecret
      },
      {
        queryKey: ['binance'],
        queryFn: getBinanceBalance,
        staleTime: Infinity,
        enabled: enabled && !!SettingsService.getSettings().apiKeys.binanceApiKey && !!SettingsService.getSettings().apiKeys.binanceApiSecret
      },
      {
        queryKey: ['kraken'],
        queryFn: getKrakenBalances,
        staleTime: Infinity,
        enabled: enabled && !!SettingsService.getSettings().apiKeys.krakenApiKey && !!SettingsService.getSettings().apiKeys.krakenApiSecret
      },
      {
        queryKey: ['bitstamp'],
        queryFn: getBitstampBalance,
        staleTime: Infinity,
        enabled: enabled && !!SettingsService.getSettings().apiKeys.bitstampApiKey && !!SettingsService.getSettings().apiKeys.bitstampApiSecret
      }
    ]
  })
  const resultsStable = useStable(results)

  const isLoading = useMemo(() => {
    return !resultsStable || some(resultsStable, 'isLoading')
  }, [resultsStable])

  const data = useMemo(() => {
    return isLoading || !enabled ? [] : flatMap(resultsStable, 'data').filter(identity)
  }, [resultsStable, isLoading, enabled])

  return {
    data,
    isLoading
  }
}

export default useExchangeBalances
