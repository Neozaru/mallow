import { useEffect, useMemo, useState } from 'react';
import { Address, formatUnits } from 'viem';
import { gnosis } from 'viem/chains';
import { useReadContracts, UseReadContractsParameters } from 'wagmi';
import { useSDaiData } from '../useDsrData';
import { useTokenBalances } from './useTokenBalances';

import sexyDaiAbi from '@/abis/sexyDaiAbi';

const sexyDaiGnosisAddress: Address = '0xaf204776c7245bF4147c2612BF6e5972Ee483701'

const sexyDaiTokenConfig: TokenConfig[] = [{
  address: sexyDaiGnosisAddress,
  chainId: gnosis.id
}]

export function useSexyDaiBalances(accountAddresses: Address[]) {
  const { data: sexyDaiShareBalances, isLoading: isLoadingBalances } = useTokenBalances(accountAddresses, sexyDaiTokenConfig)

  const { apy } = useSDaiData()

  const [assetConvertcontractReadCalls, setAssetConvertContractReadCalls] = useState<UseReadContractsParameters>({ contracts: [] })
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
    setAssetConvertContractReadCalls({
      contracts: callConfigs
    })
  }, [sexyDaiShareBalances, isLoadingBalances])

  return useMemo(() => {
    if (isLoadingBalances || isLoadingReadContracts || !assetBalanceData) {
      return { isLoading: true, balances: [] }
    }
    const balances = sexyDaiShareBalances?.map((shareBalanceData, i) => {
      const { accountAddress, balance } = shareBalanceData
      const formattedBalance = formatUnits(balance, 18)
      if (assetBalanceData[i]?.status !== 'success') {
        console.error('Sexy DAI error: Undefined result', {i, assetBalanceData, error: assetBalanceData[i]?.error})
        return []
      }
      const result = assetBalanceData[i].result
      const balanceUsd = parseFloat(formatUnits(result as bigint, 18))
      return [{
        id: `sexy-dai`,
        accountAddress,
        symbol: 'DAI',
        balance,
        balanceUsd,
        formattedBalance,
        protocol: 'dsr' as const,
        poolName: 'DSR Gnosis',
        chainId: gnosis.id,
        apy,
        type: 'dapp' as const,
        metadata: {
          link: 'https://agavefinance.eth.limo/sdai/'
        }
      }]
    })
    return { balances, isLoading: false }
  }, [assetBalanceData, sexyDaiShareBalances, isLoadingReadContracts, isLoadingBalances, apy])
}
