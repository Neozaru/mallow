import getMallowManagerContractAddressForChain from '@/lib/getMallowManagerContractAddressForChain';
import { erc20Abi } from 'viem';
import useWriteContractAndWaitForTransactionReceipt from './useWriteContractAndWaitForTransactionReceipt';
import { omit } from 'lodash';
import { useCallback, useMemo } from 'react';

const useApproveSwap = ({ fromOpportunity, baseAmountIn }) => {

  const writeContractArgs = useMemo(() => {
    if (!fromOpportunity) {
      return undefined
    }
    const { chainId, poolTokenAddress } = fromOpportunity
    const mallowManagerAddress = getMallowManagerContractAddressForChain(chainId)
    if (!mallowManagerAddress) {
      return undefined
    }
    return {
      abi: erc20Abi,
      address: poolTokenAddress,
      chainId,
      functionName: 'approve' as const,
      args: [mallowManagerAddress, baseAmountIn] as const
    }
  }, [fromOpportunity, baseAmountIn])

  const writeContractAndWaitForTxReturn = useWriteContractAndWaitForTransactionReceipt()

  const writeApprove = useCallback(
    () => {
      if (!writeContractArgs) {
        throw new Error('Initialization error for approve tx execution')
      }
      return writeContractAndWaitForTxReturn.writeContract(writeContractArgs)
    }, [writeContractArgs, writeContractAndWaitForTxReturn]
  )

  return {
    ...omit(writeContractAndWaitForTxReturn, 'writeContract'),
    writeApprove
  }
}

export default useApproveSwap
