import { useMemo } from 'react'
import { useSDaiData } from './useDsrData'
import { useTokenBalances } from './useTokenBalances'
import { gnosis, mainnet } from 'viem/chains'
import { formatUnits } from 'viem'

const dsrContracts = [
  { address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA', chainId: mainnet.id },
  { address: '0xaf204776c7245bF4147c2612BF6e5972Ee483701', chainId: gnosis.id }
]

const RAY = Math.pow(10, 27)

export function useSDaiBalances(accountAddress: string) {
  const { apy, chi } = useSDaiData()
  const { balances: dsrBalances, isLoading } = useTokenBalances([accountAddress], dsrContracts)

  const dsrBalancesRet = useMemo(() => {
    return dsrBalances?.map((bal, i) => {
      const symbol = 'sDAI'
      const chainId = dsrContracts[i].chainId
      const balance = bal.balance
      const formattedBalance = formatUnits(balance, 18)
      const balanceUsd = parseInt(`${balance}`) * chi / RAY
      const formattedBalanceUsd = formatUnits(BigInt(balanceUsd), 18)
      return {
        id: `${chainId}-DSR`,
        accountAddress,
        symbol,
        balance,
        balanceUsd: parseFloat(formattedBalanceUsd),
        formattedBalance,
        protocol: 'dsr',
        chainId,
        apy,
        type: 'dapp'
      }
    })
  }, [apy, dsrBalances])
  return dsrBalancesRet
}
