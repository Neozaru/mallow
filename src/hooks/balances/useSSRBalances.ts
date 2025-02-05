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

export function useSSRBalances(accountAddresses: Address[]) {
  const { data: sUSDSBalances, isLoading: isLoadingBalances } = useTokenBalances(accountAddresses, sUSDSTokenConfig)

  const { data: ssrData, isLoading: isLoadingSSRData } = useSSRData()

  return useMemo(() => {
    if (isLoadingBalances || isLoadingSSRData || !ssrData) {
      return { isLoading: true, balances: [] }
    }
    const balances = sUSDSBalances?.map(shareBalanceData => {
      const { accountAddress, balance, chainId } = shareBalanceData
      const formattedBalance = formatUnits(balance, 18)
      const { apy, sUSDSPriceUsd } = ssrData
      const balanceUsd = sUSDSPriceUsd * parseFloat(formattedBalance)
      return [{
        id: `ssr`,
        accountAddress,
        symbol: 'USDS',
        balance,
        balanceUsd,
        formattedBalance,
        protocol: 'ssr' as const,
        poolName: 'sUSDS',
        chainId,
        apy,
        type: 'dapp' as const,
        metadata: {
          link: 'https://app.sky.money/?widget=savings'
        }
      }]
    })
    return { balances, isLoading: false }
  }, [isLoadingBalances, isLoadingSSRData, ssrData, sUSDSBalances])
}
