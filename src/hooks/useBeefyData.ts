import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
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

async function fetchWithAxios(url) {
  const { data } = await axios.get(url)
  return data
}

export function useBeefyData(): BeefyData {
  const [vaultsQuery, boostsQuery, apysQuery] = useQueries({
    queries: [
      {
        queryKey: ['beefyVaults'],
        queryFn: () => fetchWithAxios('https://api.beefy.finance/vaults')
      },
      {
        queryKey: ['beefyBoosts'],
        queryFn: () => fetchWithAxios('https://api.beefy.finance/boosts')
      },
      {
        queryKey: ['beefyApys'],
        queryFn: () => fetchWithAxios('https://api.beefy.finance/apy')
      }
    ]
  })
  const isLoading = vaultsQuery.isLoading || boostsQuery.isLoading || apysQuery.isLoading
  return {
    vaults: vaultsQuery.data,
    boosts: boostsQuery.data,
    apys: apysQuery.data,
    isLoading
  }
}
