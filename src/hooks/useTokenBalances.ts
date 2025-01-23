import { useEffect, useMemo, useState } from 'react';
import { useReadContracts } from 'wagmi';
import { erc20Abi } from 'viem';

export function useTokenBalances(accountAddresses: string[], tokenConfigs: {address: string, chainId: number}[]) {
  const [contractReadCalls, setContractReadCalls] = useState({ contracts: [] })
  const { data, error, isLoading } = useReadContracts(contractReadCalls);

  useEffect(() => {
    if (!accountAddresses || !tokenConfigs) {
      return 
    }
    const calls = accountAddresses.flatMap(accountAddress => {
      return tokenConfigs.map(({ address, chainId }) => ({
        address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [accountAddress],
        chainId
      }));
    })
    setContractReadCalls({
      batchSize: 512, // 1024 default value fails with Alchemy when tracking too many addresses
      contracts: calls
    })
  }, [accountAddresses, tokenConfigs])

  const balances = useMemo(() => {
    return data?.map((data, i) => {
      const { chainId, address: tokenAddress, args } = contractReadCalls.contracts[i]
      return {
        balance: data.result || 0n,
        tokenAddress,
        accountAddress: args[0],
        chainId
      }
    })
  }, [data, contractReadCalls])

  return { balances, isLoading }
}