import { useMemo } from 'react';
import { Address, formatUnits } from 'viem';
import { base, mainnet } from 'viem/chains';
import { useTokenBalances } from './useTokenBalances';
import { useSSRData } from '../useSSRData';

const sUSDSTokenConfig: TokenConfig[] = [{
  address: '0xa3931d71877c0e7a3148cb7eb4463524fec27fbd',
  chainId: mainnet.id
}, {
  address: '0x5875eee11cf8398102fdad704c9e96607675467a',
  chainId: base.id
}]

export function useSSRBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: sUSDSBalances, isLoading: isLoadingBalances, refetch } = useTokenBalances(accountAddresses, sUSDSTokenConfig)

  const { data: ssrData, isLoading: isLoadingSSRData } = useSSRData()

  return useMemo(() => {
    if (isLoadingBalances || isLoadingSSRData || !ssrData || !sUSDSBalances) {
      return { isLoading: true, data: [] }
    }
    const balances = sUSDSBalances.flatMap(shareBalanceData => {
      const { accountAddress, balance, chainId, tokenAddress } = shareBalanceData
      const formattedBalance = formatUnits(balance, 18)
      const { apy, sUSDSPriceUsd } = ssrData
      const balanceUsd = sUSDSPriceUsd * parseFloat(formattedBalance)
      return [{
        id: `ssr`,
        accountAddress,
        symbol: 'USDS',
        balance,
        balanceUsd,
        poolTokenAddress: tokenAddress,
        poolAddress: tokenAddress,
        formattedBalance,
        platform: 'ssr' as const,
        poolName: 'sUSDS',
        chainId,
        apy,
        type: 'onchain' as const,
        metadata: {
          link: 'https://app.sky.money/?widget=savings'
        }
      }]
    })
    return { data: balances, isLoading: false, refetch }
  }, [isLoadingBalances, isLoadingSSRData, ssrData, sUSDSBalances, refetch])
}
