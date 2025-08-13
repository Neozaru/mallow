import { useMemo } from 'react'
import { useSDaiData } from '../useDsrData'
import { useTokenBalances } from './useTokenBalances'
import { gnosis, mainnet } from 'viem/chains'
import { Address, formatUnits } from 'viem'

const dsrContracts: TokenConfig[] = [
  { address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA', chainId: mainnet.id },
  { address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701', chainId: gnosis.id }
]

const RAY = Math.pow(10, 27)

export function useSDaiBalances(accountAddress: Address): LoadableData<YieldPositionOnChain[]> {
  const { data: sDaiData } = useSDaiData()
  const { data: dsrBalances, isLoading } = useTokenBalances([accountAddress], dsrContracts)

  const dsrBalancesRet = useMemo(() => {
    if (isLoading || !sDaiData) {
      return []
    }
    return dsrBalances?.map((bal, i) => {
      const symbol = 'sDAI'
      const { chainId, address } = dsrContracts[i]
      const balance = bal.balance
      const formattedBalance = formatUnits(balance, 18)
      const balanceUnderlying = parseInt(`${balance}`) * sDaiData.chi / RAY
      const formattedbalanceUnderlying = formatUnits(BigInt(balanceUnderlying), 18)
      return {
        id: `${chainId}-DSR`,
        accountAddress,
        symbol,
        poolName: 'DAI Savings rates',
        poolTokenAddress: address,
        poolAddress: address,
        balance,
        balanceUnderlying: parseFloat(formattedbalanceUnderlying),
        formattedBalance,
        platform: 'dsr' as const,
        chainId,
        apy: sDaiData.apy,
        type: 'onchain' as const
      }
    }) || []
  }, [sDaiData, dsrBalances, accountAddress, isLoading])
  return { data: dsrBalancesRet, isLoading }
}
