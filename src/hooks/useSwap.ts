import getMallowManagerContractAddressForChain from '@/lib/getMallowManagerContractAddressForChain';
import useWriteContractAndWaitForTransactionReceipt from './useWriteContractAndWaitForTransactionReceipt';
import { omit } from 'lodash';
import { useCallback, useMemo } from 'react';
import mallowManagerAbi from '@/abis/mallowManager.abi'
import encodeProtocolName from '@/lib/encodeProtocolName';
import getStablecoinAddress from '@/lib/getStablecoinAddress';

function applySlippage(amount: bigint): bigint {
  return (amount * BigInt(999999)) / BigInt(1000000);
}

const useSwap = ({ fromOpportunity, toOpportunity, baseAmountIn, quote }) => {
  const writeContractArgs = useMemo(() => {
    if (!fromOpportunity || !toOpportunity || !quote) {
      return undefined
    }
    const { chainId, symbol } = fromOpportunity
    const mallowManagerAddress = getMallowManagerContractAddressForChain(chainId)
    if (!mallowManagerAddress) {
      // TODO: Err mgmt
      return undefined
    }
    return {
      abi: mallowManagerAbi,
      address: mallowManagerAddress,
      chainId,
      functionName: 'executeOperation' as const,
      args: [{
        baseAssetAddress: getStablecoinAddress({ symbol, chainId }),
        fromProtocol: encodeProtocolName(fromOpportunity.platform),
        toProtocol: encodeProtocolName(toOpportunity.platform),
        fromPoolAddress: fromOpportunity.poolAddress,
        toPoolAddress: toOpportunity.poolAddress,
        fromLpTokenAddress: fromOpportunity.poolTokenAddress,
        toLpTokenAddress: toOpportunity.poolTokenAddress,
        fromLpTokenAmount: baseAmountIn,
        toMinLpTokenAmount: applySlippage(quote[1]) // TODO: Name variables once quote system is mature
      }] as const
    }
  }, [fromOpportunity, toOpportunity, baseAmountIn, quote])

  const writeContractAndWaitForTxReturn = useWriteContractAndWaitForTransactionReceipt()

  const writeSwap = useCallback(
    () => {
      if (!writeContractArgs) {
        throw new Error('Initialization error for swap tx execution')
      }
      return writeContractAndWaitForTxReturn.writeContract(writeContractArgs)
    },
    [writeContractArgs, writeContractAndWaitForTxReturn]
  )

  return {
    ...omit(writeContractAndWaitForTxReturn, 'writeContract'),
    writeSwap
  }
}

export default useSwap
