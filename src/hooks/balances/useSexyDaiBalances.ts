import { useMemo } from 'react';
import { Address, formatUnits } from 'viem';
import { gnosis } from 'viem/chains';
import { useReadContracts, UseReadContractsParameters } from 'wagmi';
import { useTokenBalances } from './useTokenBalances';

import sexyDaiAbi from '@/abis/sexyDaiAbi';
import useSexyDaiOpportunities from '../useSexyDaiOpportunities';
import { find } from 'lodash';

const initialContractReadCalls = { contracts: [] }
export function useSexyDaiBalances(accountAddresses: Address[]): LoadableData<YieldPositionOnChain[]> {
  const { data: sexyDaiOpportunities, isLoading: isLoadingSexyDaiOpportunities } = useSexyDaiOpportunities()

  const sexyDaiTokenConfig = useMemo(() => {
    if (isLoadingSexyDaiOpportunities) {
      return []
    }
    return sexyDaiOpportunities?.map(({ poolTokenAddress, chainId }) =>
      ({ address: poolTokenAddress, chainId })
    ) || []
  }, [sexyDaiOpportunities, isLoadingSexyDaiOpportunities])

  const { data: sexyDaiShareBalances, isLoading: isLoadingBalances, refetch } = useTokenBalances(accountAddresses, sexyDaiTokenConfig)

  const assetConvertcontractReadCalls = useMemo<UseReadContractsParameters>(() => {
    if (isLoadingBalances) {
      return initialContractReadCalls
    }
    const callConfigs = sexyDaiShareBalances?.map(balanceData => {
      return {
        address: balanceData.tokenAddress,
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
    if (isLoadingBalances || isLoadingReadContracts || !assetBalanceData || !sexyDaiShareBalances) {
      return { isLoading: true, data: [] }
    }
    const balances = sexyDaiShareBalances.flatMap((shareBalanceData, i) => {
      const { accountAddress, balance } = shareBalanceData
      const formattedBalance = formatUnits(balance, 18)
      if (assetBalanceData[i]?.status !== 'success') {
        console.error('Sexy DAI error: Undefined result', {i, assetBalanceData, error: assetBalanceData[i]?.error})
        return []
      }
      const balanceUnderlying = parseFloat(formatUnits(assetBalanceData[i].result, 18))
      const opportunity = find(sexyDaiOpportunities, { poolTokenAddress: shareBalanceData.tokenAddress })
      if (!opportunity) {
        throw new Error('Cant find back sexyDAI oppportunity')
      }
      return [{
        ...opportunity,
        accountAddress,
        balance,
        balanceUnderlying,
        formattedBalance,
      }]
    })
    return { data: balances, isLoading: false, refetch }
  }, [assetBalanceData, sexyDaiShareBalances, isLoadingReadContracts, isLoadingBalances, sexyDaiOpportunities, refetch])
}
