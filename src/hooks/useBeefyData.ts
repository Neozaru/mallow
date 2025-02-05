import { axiosGetCached } from '@/lib/axiosGetCached'
import { useEffect, useState } from 'react'
import { Address } from 'viem';

type BeefyVault = {
  id: string;
  assets: string[];
  token: string;
  chain: number;
  earnContractAddress: Address;
  pricePerFullShare: bigint;
}

type BeefyBoost = BeefyVault & {
  poolId: string;
}

type BeefyApys = { [poolId: string]: number };

type BeefyData = {
  vaults: BeefyVault[];
  boosts: BeefyBoost[];
  apys: BeefyApys;
  isLoading: boolean;
}

export function useBeefyData() {
  const [beefyData, setBeefyData] = useState<BeefyData>({ isLoading: true, vaults: [], boosts: [], apys: {} })
  useEffect(() => {
    async function fetchData() {
      const { data: vaults } = await axiosGetCached<BeefyVault[]>('https://api.beefy.finance/vaults')
      const { data: boosts } = await axiosGetCached<BeefyBoost[]>('https://api.beefy.finance/boosts')
      const { data: apys } = await axiosGetCached<BeefyApys>('https://api.beefy.finance/apy')
      setBeefyData({ vaults, boosts, apys, isLoading: false })
    }
    fetchData()
  }, [])

  return beefyData
}
