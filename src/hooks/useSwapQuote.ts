import mallowManagerAbi from '@/abis/mallowManager.abi'
import encodeProtocolName from '@/lib/encodeProtocolName'
import getMallowManagerContractAddressForChain from '@/lib/getMallowManagerContractAddressForChain'
import getStablecoinAddress from '@/lib/getStablecoinAddress'
import { useMemo } from 'react'
import { useReadContract } from 'wagmi'

const useSwapQuote = ({ fromOpportunity, toOpportunity, baseAmountIn }) => {
  const readContractParams = useMemo(() => {
    if (!fromOpportunity || !toOpportunity || baseAmountIn === BigInt(0)) {
      return undefined
    }
    const { symbol, chainId } = fromOpportunity
    return {
      abi: mallowManagerAbi,
      address: getMallowManagerContractAddressForChain(chainId),
      chainId,
      functionName: 'previewExecuteOperation' as const,
      args: [
        getStablecoinAddress({ symbol, chainId }),
        encodeProtocolName(fromOpportunity.platform),
        encodeProtocolName(toOpportunity.platform),
        fromOpportunity.poolAddress,
        toOpportunity.poolAddress,
        fromOpportunity.poolTokenAddress,
        baseAmountIn,
        toOpportunity.poolTokenAddress,
      ] as const,
    }
  }, [fromOpportunity, toOpportunity, baseAmountIn])
  return useReadContract(readContractParams)
}

export default useSwapQuote
