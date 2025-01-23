import stablecoins from '@/constants/stablecoins'
import { axiosGetCached } from '@/lib/axiosGetCached'
import { wagmiconfig } from '@/wagmiconfig'
import { useEffect, useState } from 'react'

export function useAaveStablecoinData() {
  const [isLoading, setIsLoading] = useState(true)
  const [aaveStablecoinData, setAaveStablecoinData] = useState([])
  useEffect(() => {
    async function fetchData() {
      const supportedChainIds = wagmiconfig.chains.map(({ id }) => id)
      const stablecoinsAaveSymbols = stablecoins.flatMap(symbol => [symbol, `${symbol}.E`])
      const { data } = await axiosGetCached(
        `/api/defi/aave/poolsdata?symbols=${stablecoinsAaveSymbols}&chainIds=${supportedChainIds}`,
        600000
      )
      setAaveStablecoinData(data)
      setIsLoading(false)
    }
    setIsLoading(true)
    fetchData()
  }, [])
  return { data: aaveStablecoinData, isLoading }
}
