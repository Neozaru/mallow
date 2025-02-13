import { useMemo } from 'react';
import { useReadContracts, UseReadContractsParameters } from 'wagmi';
import { Address, ContractFunctionParameters, erc20Abi } from 'viem';

type TokenBalance = {
  tokenAddress: Address;
  chainId: number;
  accountAddress: Address;
  balance: bigint;
}

const initialContractReadCalls = { batchSize: 512, contracts: [] }
export function useTokenBalances(accountAddresses: Address[], tokenConfigs: TokenConfig[]): LoadableData<TokenBalance[]> {
  const contractReadCalls = useMemo<UseReadContractsParameters>(() => {
    if (!accountAddresses || !tokenConfigs) {
      return initialContractReadCalls
    }
    const calls: ContractFunctionParameters[] = accountAddresses.flatMap(accountAddress => {
      return tokenConfigs.map(({ address, chainId }) => ({
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
  }, [accountAddresses, tokenConfigs])

  const { data, error, isLoading: isReadContractLoading, isFetching: isReadContractFetching } = useReadContracts<ContractCallBigIntResult[]>(contractReadCalls);
  
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
    return { isLoading: false, error, data: balances, isFetching: isReadContractFetching }

  }, [data, contractReadCalls, isReadContractLoading, error, isReadContractFetching])
}