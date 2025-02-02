import { useMemo } from 'react'
import { useBeefyData } from './useBeefyData'
import { capitalize, find } from 'lodash'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import stablecoins from '@/constants/stablecoins'

const shouldIncludeVault = vault => vault.status === 'active' &&
  getSupportedChainIds().includes(vault.chainId) &&
  vault.assets.length === 1 && // Single-asset only
  stablecoins.includes(vault.token)

const useBeefyOpportunities = () => {
  const { vaults, boosts, apys, isLoading } = useBeefyData()

  return useMemo(() => {
    if (isLoading || !vaults || !boosts || !apys) {
      return { data: [], isLoading: true }
    }

    const vaultOpportunities = vaults
      .filter(shouldIncludeVault)
      .map(({ id, chainId, earnContractAddress, token }) => ({
        id,
        symbol: token,
        poolTokenAddress: earnContractAddress,
        apy: apys[id],
        protocol: 'beefy',
        poolName: id.split('-').map(capitalize).join(' '),
        chainId,
      }))
    
    const boostOpportunities = boosts.map(({ id, chainId, earnContractAddress, poolId }) => {
      const vault = find(vaults, { id: poolId })
      if (!vault || !shouldIncludeVault(vault)) {
        return
      }
      return {
        id,
        symbol: vault.token,
        poolTokenAddress: earnContractAddress,
        apy: apys[vault.id],
        protocol: 'beefy',
        poolName: 'Boosted ' + vault.id.split('-').map(capitalize).join(' '),
        chainId,
      }
    }).filter(o => !!o)

    const opportunities = [
      ...vaultOpportunities,
      ...boostOpportunities
    ]
    return { data: opportunities, isLoading: false }
  }, [vaults, boosts, apys, isLoading])
}

export default useBeefyOpportunities
