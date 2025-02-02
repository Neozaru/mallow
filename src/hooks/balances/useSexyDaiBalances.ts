import { useEffect, useMemo, useState } from 'react';
import { formatUnits } from 'viem';
import { gnosis } from 'viem/chains';
import { useReadContracts } from 'wagmi';
import { useSDaiData } from '../useDsrData';
import { useTokenBalances } from './useTokenBalances';

import sexyDaiAbi from '@/abis/sexyDai.abi.json'

const sexyDaiGnosisAddress = '0xaf204776c7245bF4147c2612BF6e5972Ee483701'

const sexyDaiTokenConfig = [{
  address: sexyDaiGnosisAddress,
  chainId: gnosis.id
}]

export function useSexyDaiBalances(accountAddresses: string[]) {
  const { balances: sexyDaiShareBalances, isLoading: isLoadingBalances } = useTokenBalances(accountAddresses, sexyDaiTokenConfig)

  const { apy } = useSDaiData()

  const [assetConvertcontractReadCalls, setAssetConvertContractReadCalls] = useState({ contracts: [] })
  const { data: assetBalanceData, isLoading: isLoadingReadContracts } = useReadContracts(assetConvertcontractReadCalls);

  useEffect(() => {
    if (isLoadingBalances) {
      return
    }
    const callConfigs = sexyDaiShareBalances?.map(balanceData => {
      return {
        address: sexyDaiGnosisAddress,
        abi: sexyDaiAbi,
        functionName: 'convertToAssets',
        args: [balanceData.balance],
        chainId: gnosis.id
      }
    })
    setAssetConvertContractReadCalls({ contracts: callConfigs })
  }, [sexyDaiShareBalances, isLoadingBalances])

  return useMemo(() => {
    if (isLoadingBalances || isLoadingReadContracts || !assetBalanceData) {
      return { isLoading: true, balances: [] }
    }
    const balances = sexyDaiShareBalances?.map((shareBalanceData, i) => {
      const { accountAddress, balance } = shareBalanceData
      const formattedBalance = formatUnits(balance, 18)
      if (assetBalanceData[i]?.status !== 'success') {
        console.error('Sexy DAI error: Undefined result', {i, assetBalanceData})
        return []
      }
      const result = assetBalanceData[i].result
      const balanceUsd = parseFloat(formatUnits(result, 18))
      return [{
        id: `sexy-dai`,
        accountAddress,
        symbol: 'DAI',
        balance,
        balanceUsd,
        formattedBalance,
        protocol: 'dsr',
        poolName: 'DSR Gnosis',
        chainId: gnosis.id,
        apy,
        type: 'dapp'
      }]
    })
    return { balances, isLoading: false }
  }, [assetBalanceData, sexyDaiShareBalances, isLoadingReadContracts, isLoadingBalances, apy])
}
