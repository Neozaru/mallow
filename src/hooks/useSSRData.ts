import { axiosGetCached } from '@/lib/axiosGetCached'
import { useEffect, useState } from 'react'

type SkyUnofficialApiResponse = {
  sky_savings_rate_apy: string;
  susds_price_usd: string;
}

type SSRData = {
  apy: number;
  sUSDSPriceUsd: number;
}

export function useSSRData(): LoadableData<SSRData> {
  const [isLoading, setIsLoading] = useState(true)
  const [sSRData, setSSRData] = useState<SSRData>()

  useEffect(() => {
    async function fetchData() {
      const { data } = await axiosGetCached<SkyUnofficialApiResponse>(
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
  return { data: sSRData, isLoading }
}
