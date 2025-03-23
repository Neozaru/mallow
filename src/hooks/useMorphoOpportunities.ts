import stablecoins from '@/constants/stablecoins'
import createOpportunity from '@/lib/createOpportunity'
import { GET_VAULTS } from '@/lib/graphqlMorpho/GET_VAULTS'
import { baseToShares } from '@/lib/lpUtils'
import getMorphoVaultLink from '@/utils/getMorphoVaultLink'
import getSupportedChainIds from '@/utils/getSupportedChainIds'
import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'
import { every } from 'lodash'
import { useMemo } from 'react'
import { Address } from 'viem'

type MorphoVault = {
  id: string;
  name: string;
  address: Address;
  chain: {
    id: number;
    network: string;
  };
  asset: {
    symbol: string;
  };
  dailyApys: {
    netApy: number;
    apy: number;
  };
  state: {
    sharePrice: number;
    sharePriceUsd: number;
    allocation: {
      market: {
        collateralAsset: {
          symbol: string;
        }
      }
    }[]
  }
}

type MorphoVaultsResult = {
  vaults: {
    items: MorphoVault[];
  }
}

// Subjective whitelist of collateral.
const collateralWhitelist = [
  'UNI',
  'wstETH',
  'cbETH',
  'cbBTC',
  'WBTC',
  'rETH',
  'WETH'
]

const isVaultCollateralInWhitelist = vault => {
  return every(vault.state.allocation, alloc => !alloc.market.collateralAsset || collateralWhitelist.includes(alloc.market.collateralAsset?.symbol))
}

const useMorphoOpportunities = () => {

  const { data, isLoading } = useQuery<MorphoVaultsResult>({
    queryKey: ['vaults'],
    queryFn: () =>
      request(
        'https://blue-api.morpho.org/graphql',
        GET_VAULTS,
        {
          where: {
            chainId_in: getSupportedChainIds(),
            assetSymbol_in: stablecoins,
            whitelisted: true
          },
        }
      )
  })

  return useMemo(() => {
    if (isLoading || !data) {
      return { data: [], isLoading: true }
    }
    const opportunities: YieldOpportunityOnChain[] = data.vaults.items
      .filter(isVaultCollateralInWhitelist)
      .map(vault => {
        return createOpportunity({
          id: vault.id,
          symbol: vault.asset.symbol,
          platform: 'morpho' as const,
          poolName: vault.name,
          poolTokenAddress: vault.address,
          chainId: vault.chain.id,
          apy: vault.dailyApys.netApy,
          rateToPrincipal: vault.state.sharePrice,
          convertPrincipalToLP: principal => baseToShares(principal, BigInt(vault.state.sharePrice)), // TODO: Find definitive solution
          type: 'onchain' as const,
          metadata: {
            link: getMorphoVaultLink(vault)
          }
        })
      })
    return { data: opportunities, isLoading: false }
  }, [data, isLoading])

}

export default useMorphoOpportunities