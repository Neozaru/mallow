import { useMemo } from 'react';
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

const initialContractReadCalls = { contracts: [] }
export function useSexyDaiBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: sexyDaiShareBalances, isLoading: isLoadingBalances, refetch } = useTokenBalances(accountAddresses, sexyDaiTokenConfig)

  const { data: sDaiData, isLoading: isLoadingSDaiData } = useSDaiData()

  const assetConvertcontractReadCalls = useMemo<UseReadContractsParameters>(() => {
    if (isLoadingBalances) {
      return initialContractReadCalls
    }
    const callConfigs = sexyDaiShareBalances?.map(balanceData => {
      return {
        address: sexyDaiGnosisAddress,
        abi: sexyDaiAbi,
        functionName: 'convertToAssets',
        args: [balanceData.balance],
        chainId: gnosis.id
      }
    }) || []
    return {
      contracts: callConfigs
    }
  }, [sexyDaiShareBalances, isLoadingBalances])

  const { data: assetBalanceData, isLoading: isLoadingReadContracts } = useReadContracts<ContractCallBigIntResult>(assetConvertcontractReadCalls);

  return useMemo(() => {
    if (isLoadingBalances || isLoadingReadContracts || isLoadingSDaiData || !assetBalanceData || !sexyDaiShareBalances) {
      return { isLoading: true, data: [] }
    }
    const balances = sexyDaiShareBalances.flatMap((shareBalanceData, i) => {
      const { accountAddress, balance } = shareBalanceData
      const formattedBalance = formatUnits(balance, 18)
      if (assetBalanceData[i]?.status !== 'success') {
        console.error('Sexy DAI error: Undefined result', {i, assetBalanceData, error: assetBalanceData[i]?.error})
        return []
      }
      const balanceUsd = parseFloat(formatUnits(assetBalanceData[i].result, 18))
      return [{
        id: `sexy-dai`,
        accountAddress,
        poolTokenAddress: sexyDaiGnosisAddress,
        poolAddress: sexyDaiGnosisAddress,
        symbol: 'DAI',
        balance,
        balanceUsd,
        formattedBalance,
        platform: 'dsr' as const,
        poolName: 'DAI Savings',
        chainId: gnosis.id,
        apy: sDaiData?.apy || 0,
        type: 'onchain' as const,
        metadata: {
          link: 'https://agavefinance.eth.limo/sdai/'
        }
      }]
    })
    return { data: balances, isLoading: false, refetch }
  }, [assetBalanceData, sexyDaiShareBalances, isLoadingReadContracts, isLoadingBalances, isLoadingSDaiData, sDaiData, refetch])
}
