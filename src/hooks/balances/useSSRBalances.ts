import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { base, mainnet } from 'viem/chains';
import { useTokenBalances } from './useTokenBalances';
import { useSSRData } from '../useSSRData';

const sUSDSTokenConfig = [{
  address: '0xa3931d71877c0e7a3148cb7eb4463524fec27fbd',
  chainId: mainnet.id
}, {
  address: '0x5875eee11cf8398102fdad704c9e96607675467a',
  chainId: base.id
}]

export function useSSRBalances(accountAddresses: string[]) {
  const { balances: sUSDSBalances, isLoading: isLoadingBalances } = useTokenBalances(accountAddresses, sUSDSTokenConfig)

  const { data: { apy, sUSDSPriceUsd }, isLoading: isLoadingSSRData } = useSSRData()

  return useMemo(() => {
    if (isLoadingBalances || isLoadingSSRData) {
      return { isLoading: true, balances: [] }
    }
    const balances = sUSDSBalances?.map((shareBalanceData, i) => {
      const { accountAddress, balance, chainId } = shareBalanceData
      const formattedBalance = formatUnits(balance, 18)
      const balanceUsd = sUSDSPriceUsd * parseFloat(formattedBalance)
      return [{
        id: `ssr`,
        accountAddress,
        symbol: 'USDS',
        balance,
        balanceUsd,
        formattedBalance,
        protocol: 'ssr',
        poolName: 'sUSDS',
        chainId,
        apy,
        type: 'dapp',
        metadata: {
          link: 'https://app.sky.money/?widget=savings'
        }
      }]
    })
    return { balances, isLoading: false }
  }, [isLoadingBalances, isLoadingSSRData, apy, sUSDSPriceUsd, sUSDSBalances])
}
