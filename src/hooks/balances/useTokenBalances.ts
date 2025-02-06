import { useEffect, useMemo, useState } from 'react';
import { useReadContracts, UseReadContractsParameters } from 'wagmi';
import { Address, ContractFunctionParameters, erc20Abi } from 'viem';

type TokenBalance = {
  tokenAddress: Address;
  chainId: number;
  accountAddress: Address;
  balance: bigint;
}

export function useTokenBalances(accountAddresses: Address[], tokenConfigs: TokenConfig[]): LoadableData<TokenBalance[]> {
  const [contractReadCalls, setContractReadCalls] = useState<UseReadContractsParameters>({ batchSize: 512, contracts: [] })
  const { data, error, isLoading: isReadContractLoading } = useReadContracts<ContractCallBigIntResult[]>(contractReadCalls);

  useEffect(() => {
    if (!accountAddresses || !tokenConfigs) {
      return 
    }
    const calls: ContractFunctionParameters[] = accountAddresses.flatMap(accountAddress => {
      return tokenConfigs.map(({ address, chainId }) => ({
        address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [accountAddress as `0x${string}`],
        chainId
      }))
    })
    setContractReadCalls({
      batchSize: 512, // 1024 default value fails with Alchemy when tracking too many addresses
      contracts: calls
    })
  }, [accountAddresses, tokenConfigs])

  return useMemo(() => {
    if (!contractReadCalls.contracts || isReadContractLoading || !data) {
      return { isLoading: true, data: [], error }
    }
    const typedData = data as ContractCallBigIntResult[]
    const balances = typedData.map((data, i) => {
      const { chainId, address, args } = contractReadCalls.contracts![i]
      const balance = data.status === 'success' ? data.result :  BigInt(0)
      const accountAddress: Address = args![0] as Address // We know this is set because we set it ourselves earlier in the lifecycle
      return {
        balance,
        tokenAddress: address!,
        accountAddress, 
        chainId: chainId!
      }
    })
    return { isLoading: false, error, data: balances }
  }, [data, contractReadCalls, isReadContractLoading, error])
}