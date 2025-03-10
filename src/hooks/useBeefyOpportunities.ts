import { useMemo } from 'react'
import { useBeefyData } from './useBeefyData'
import { capitalize, find } from 'lodash'
import stablecoins from '@/constants/stablecoins'
import getChainIdFromBeefyName from '@/utils/getChainIdFromBeefyName'
import createOpportunity from '@/lib/createOpportunity'

const shouldIncludeVault = vault => vault.status === 'active' &&
  !!getChainIdFromBeefyName(vault.chain) &&
  vault.assets.length === 1 && // Single-asset only
  stablecoins.includes(vault.token)

const useBeefyOpportunities = (): LoadableData<YieldOpportunityOnChain[]> => {
  const { vaults, boosts, apys, isLoading } = useBeefyData()
  return useMemo(() => {
    if (isLoading || !vaults || !boosts || !apys) {
      return { data: [], isLoading: true }
    }

    const vaultOpportunities = vaults
      .filter(shouldIncludeVault)
      .map(({ id, chain, earnContractAddress, token }): YieldOpportunityOnChain => createOpportunity({
        id,
        symbol: token,
        poolTokenAddress: earnContractAddress,
        apy: apys[id],
        platform: 'beefy' as const,
        poolName: id.split('-').map(capitalize).join(' '),
        chainId: getChainIdFromBeefyName(chain),
        type: 'onchain' as const,
        rateToPrincipal: 1,
        metadata: {
          link: `https://app.beefy.com/vault/${id}`
        }
      }))
    
    const boostOpportunities = boosts.map(({ id, chain, earnContractAddress, poolId }): YieldOpportunityOnChain | undefined => {
      const vault = find(vaults, { id: poolId })
      if (!vault || !shouldIncludeVault(vault)) {
        return
      }
      return createOpportunity({
        id,
        symbol: vault.token,
        poolTokenAddress: earnContractAddress,
        apy: apys[vault.id],
        platform: 'beefy' as const,
        poolName: 'Boost ' + vault.id.split('-').map(capitalize).join(' '),
        chainId: getChainIdFromBeefyName(chain),
        type: 'onchain' as const,
        rateToPrincipal: 1,
        metadata: {
          link: `https://app.beefy.com/vault/${poolId}`
        }
      })
    }).filter(o => !!o)

    const opportunities = [
      ...vaultOpportunities,
      ...boostOpportunities
    ]
    return { data: opportunities, isLoading: false }
  }, [vaults, boosts, apys, isLoading])
}

export default useBeefyOpportunities
