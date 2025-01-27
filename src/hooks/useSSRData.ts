import { axiosGetCached } from '@/lib/axiosGetCached'
import { useEffect, useState } from 'react'

export function useSSRData() {
  const [isLoading, setIsLoading] = useState(true)
  const [SSRData, setSSRData] = useState({})

  useEffect(() => {
    async function fetchData() {
      const { data } = await axiosGetCached(
        `/api/defi/sky/overall`,
        60000
      )
      const newSSRData = {
        apy: parseFloat(data[0].sky_savings_rate_apy),
        sUSDSPriceUsd: parseFloat(data[6].susds_price_usd)
      }
      setSSRData(newSSRData)
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchData()
  }, [])
  return { data: SSRData, isLoading }
}
