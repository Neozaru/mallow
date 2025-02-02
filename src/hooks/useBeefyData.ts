import stablecoins from '@/constants/stablecoins'
import { axiosGetCached } from '@/lib/axiosGetCached'
import getChainIdFromBeefyName from '@/utils/getChainIdFromBeefyName'
import { useEffect, useState } from 'react'

function filterAndProcessBeefyData(data: {assets: string[], token: string, chain: number}[]) {
  // Only select vaults for whitelisted chains
  return data.filter(d =>
    !!getChainIdFromBeefyName(d.chain) &&
    d.assets.every(asset => stablecoins.includes(asset))
    || stablecoins.includes(d.token)
  // Add chainId for each entry
  ).map(d =>
    ({
      ...d,
      chainId: getChainIdFromBeefyName(d.chain)
    })
  )
} 

export function useBeefyData() {
  const [beefyData, setBeefyData] = useState({ isLoading: true })
  useEffect(() => {
    async function fetchData() {
      const { data: vaultsData } = await axiosGetCached('https://api.beefy.finance/vaults')
      const { data: boostsData } = await axiosGetCached('https://api.beefy.finance/boosts')
      const { data: apys } = await axiosGetCached('https://api.beefy.finance/apy')

      const vaults = filterAndProcessBeefyData(vaultsData)
      const boosts = filterAndProcessBeefyData(boostsData)

      setBeefyData({ vaults, boosts, apys, isLoading: false })
    }
    fetchData()
  }, [])

  return beefyData
}
