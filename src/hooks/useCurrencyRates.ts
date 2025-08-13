import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useMemo } from 'react'

const useCurrencyRates = () => {
  const { data: eurRateData, isLoading: isEurRateLoading, error: eurRateError } = useQuery({
    queryKey: ['eurRate'],
    queryFn: async () => {
      const url = `https://api.frankfurter.dev/v1/latest?from=EUR&to=USD`
      const { data } = await axios.get(url)
      return data
    },
    staleTime: 3600 * 1000,
  })

  return useMemo(() => {
    if (isEurRateLoading || eurRateError || !eurRateData) {
      return {
        isLoading: isEurRateLoading,
        error: eurRateError
      }
    }
    return {
      data: {
        EUR: eurRateData.rates.USD
      },
      isLoading: false
    }
  }, [isEurRateLoading, eurRateError, eurRateData])
}

export default useCurrencyRates
