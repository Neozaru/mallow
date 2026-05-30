import stablecoins from '@/constants/stablecoins'
import createOpportunity from '@/lib/createOpportunity'
import { GET_VAULTS } from '@/lib/graphqlMorpho/GET_VAULTS'
import { baseToShares } from '@/lib/lpUtils'
import getMorphoVaultLink from '@/utils/getMorphoVaultLink'
import { useQuery } from '@tanstack/react-query'
import request from 'graphql-request'
import { every } from 'lodash'
import { useMemo } from 'react'
import { Address } from 'viem'
import { arbitrum, base, mainnet, optimism, polygon, unichain } from 'viem/chains'

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
  state: {
    avgNetApyExcludingRewards: number;
    avgNetApy: number;
    sharePriceNumber: number;
    sharePriceUsd: number;
    allocation: {
      market: {
        collateralAsset: {
          symbol: string;
        }
      }
    }[]
  };
}

type MorphoVaultsResult = {
  vaults: {
    items: MorphoVault[];
  }
}

// Subjective whitelist of collateral.
const collateralWhitelist = [
  'UNI',
  'USDC',
  'EURC',
  'JPYC',
  'wstETH',
  'cbETH',
  'cbBTC',
  'WBTC',
  'rETH',
  'WETH',
  'rETH',
]

const chainsWhitelist = [
  mainnet.id,
  optimism.id,
  arbitrum.id,
  base.id,
  polygon.id,
  unichain.id,
]

const isVaultCollateralInWhitelist = vault => {
  return every(vault.state.allocation, alloc => !alloc.market.collateralAsset || collateralWhitelist.includes(alloc.market.collateralAsset?.symbol))
}

const useMorphoOpportunities = () => {

  const { data, isLoading, error } = useQuery<MorphoVaultsResult>({
    queryKey: ['vaults'],
    queryFn: () =>
      request(
        'https://blue-api.morpho.org/graphql',
        GET_VAULTS,
        {
          where: {
            chainId_in: chainsWhitelist,
            assetSymbol_in: stablecoins,
            listed: true
          },
        }
      )
  })

  return useMemo(() => {
    if (error && !isLoading) {
      console.error('Error fetching Morpho vaults', error)
      return { data: [], isLoading: false }
    }
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
          apy: vault.state.avgNetApyExcludingRewards,
          rateToPrincipal: BigInt(Math.round(Number(vault.state.sharePriceNumber) * 1_000_000)),
          convertPrincipalToLP: principal =>
            baseToShares(principal, BigInt(Math.round(Number(vault.state.sharePriceNumber) * 1_000_000))),
          // convertPrincipalToLP: principal => principal / vault.state.sharePrice, // TODO: Find definitive solution
          type: 'onchain' as const,
          metadata: {
            link: getMorphoVaultLink(vault)
          }
        })
      })
    return { data: opportunities, isLoading: false }
  }, [data, error, isLoading])

}

export default useMorphoOpportunities