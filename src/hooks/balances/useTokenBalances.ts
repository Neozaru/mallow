import { useMemo } from 'react';
import { useReadContracts, UseReadContractsParameters } from 'wagmi';
import { Address, ContractFunctionParameters, erc20Abi } from 'viem';
import getSupportedChainIds from '@/utils/getSupportedChainIds';

type TokenBalance = {
  tokenAddress: Address;
  chainId: number;
  accountAddress: Address;
  balance: bigint;
}
const supportedChainIds = getSupportedChainIds()
const initialContractReadCalls = { batchSize: 512, contracts: [] }
export function useTokenBalances(accountAddresses: Address[], tokenConfigs: TokenConfig[]): LoadableData<TokenBalance[]> {
  
  // Ensures that we only attempt to fetch balances for tokens on supported chains, which prevents errors from unsupported chains and also reduces the number of calls we need to make.
  const filteredTokenConfigs = useMemo(() => {
    return tokenConfigs.filter(tc => supportedChainIds.includes(tc.chainId))
  }, [tokenConfigs]);

  const contractReadCalls = useMemo<UseReadContractsParameters>(() => {
    if (!accountAddresses || !filteredTokenConfigs) {
      return initialContractReadCalls
    }
    const calls: ContractFunctionParameters[] = accountAddresses.flatMap(accountAddress => {
      return filteredTokenConfigs.map(({ address, chainId }) => ({
        address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [accountAddress],
        chainId
      }))
    })
    return {
      batchSize: 512, // 1024 default value fails with Alchemy when tracking too many addresses
      contracts: calls
    }
  }, [accountAddresses, filteredTokenConfigs])

  const { data, error, isLoading: isReadContractLoading, isFetching: isReadContractFetching, refetch } = useReadContracts<ContractCallBigIntResult[]>(contractReadCalls);
  return useMemo(() => {
    if (!contractReadCalls.contracts || isReadContractLoading) {
      return { isLoading: true, data: [], error }
    }
    const balances = data?.map((data, i) => {
      const contractCallConfig = contractReadCalls.contracts![i]
      const { chainId, address, args } = contractCallConfig
      const balance = data.status === 'success' ? data.result : BigInt(0)
      const accountAddress: Address = args![0] as Address // We know this is set because we set it ourselves earlier in the lifecycle
      return {
        balance,
        tokenAddress: address!,
        accountAddress, 
        chainId: chainId!
      }
    }) || []
    return { isLoading: false, error, data: balances, isFetching: isReadContractFetching, refetch }
  }, [data, contractReadCalls, isReadContractLoading, error, isReadContractFetching, refetch])
}