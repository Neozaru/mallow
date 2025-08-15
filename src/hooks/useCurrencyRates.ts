import useStable from '@/utils/useStable'
import { useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { useMemo } from 'react'

const staleTime = 3600 * 1000

const currenciesConfig = [
  {
    currency: 'EUR',
    queryUrl: 'https://api.frankfurter.dev/v1/latest?from=EUR&to=USD',
    extractData: data => data.rates.USD
  },
    {
    currency: 'BTC',
    queryUrl: 'https://blockchain.info/ticker',
    extractData: data => data.USD.last
  }
]

const queries = {
  queries: currenciesConfig.map(({currency, queryUrl, extractData}) => ({
    queryKey: [`currency_rate_${currency}`],
    queryFn: async () => {
      const { data } = await axios.get(queryUrl)
      return extractData(data)
    },
    staleTime,
  }))
}

const useCurrencyRates = () => {
  const queryResults = useQueries(queries)
  const queryResultsStable = useStable(queryResults)

  const areQueriesLoading = useMemo(() => !!queryResults.find(r => r.isLoading), [queryResults])
  return useMemo(() => {
    if (areQueriesLoading) {
      return {
        isLoading: areQueriesLoading,
      }
    }
    const rates = queryResultsStable.reduce((acc, result, index) => ({
      [currenciesConfig[index].currency]: result?.data,
      ...acc
    }), {})
    return {
      data: rates,
      isLoading: false
    }
  }, [areQueriesLoading, queryResultsStable])
}

export default useCurrencyRates
