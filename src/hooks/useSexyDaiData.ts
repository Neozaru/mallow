import { useReadContracts } from 'wagmi'

import sexyDaiAbi from '@/abis/sexyDaiAbi';
import { gnosis } from 'viem/chains';
import { useMemo } from 'react';
import { useSSRData } from './useSSRData';

const sexyDaiContractAddress = '0xaf204776c7245bf4147c2612bf6e5972ee483701'

export function useSexyDaiData() {
  const { data: contractData, isLoading: isContractDataLoading } = useReadContracts({
    contracts: [{
      abi: sexyDaiAbi,
      address: sexyDaiContractAddress,
      functionName: 'totalSupply',
      args: [],
      chainId: gnosis.id
    }, {
      abi: sexyDaiAbi,
      address: sexyDaiContractAddress,
      functionName: 'totalAssets',
      args: [],
      chainId: gnosis.id
    }]
  })

  const { data: ssrData, isLoading: isSSRDataLoading } = useSSRData()

  return useMemo(() => {
    if (isContractDataLoading || isSSRDataLoading) {
      return { isLoading: true, data: null }
    }
    const totalSupply = contractData?.[0]?.result || BigInt(0)
    const totalAssets = contractData?.[1]?.result || BigInt(0)

    const precision = BigInt(10) ** BigInt(18);
    const scaledRatio = totalAssets * precision / totalSupply
    const floatRatio = Number(scaledRatio) / 1e18
    const nativeApy = ssrData?.apy || 0.045
    const apy = floatRatio * nativeApy 
    return {
      data:{
        apy,
        rateToPrincipal: floatRatio
      },
      isLoading: false,
    }
  }, [contractData, isContractDataLoading, isSSRDataLoading, ssrData])
}
