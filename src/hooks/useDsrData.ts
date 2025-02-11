import { useMemo } from 'react';
import { mainnet } from 'viem/chains';
import { useReadContracts, UseReadContractsParameters } from 'wagmi';

import daiPotAbi from '@/abis/daiPotAbi';
import { Address } from 'viem';

const unsafeConvertBigNumberToNumer = (bn: bigint) => Number(bn.toString())
const potContractAddress: Address = `0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7`

const readContractsParams: UseReadContractsParameters = {
  contracts: [{
    address: potContractAddress,
    abi: daiPotAbi,
    functionName: 'dsr',
    args: [],
    chainId: mainnet.id
  }, {
    address: potContractAddress,
    abi: daiPotAbi,
    functionName: 'chi',
    args: [],
    chainId: mainnet.id
  }, {
    address: potContractAddress,
    abi: daiPotAbi,
    functionName: 'rho',
    args: [],
    chainId: mainnet.id
  }]
}

type DaiPotData = {
  apy: number;
  chi: number;
  rho: number;
}

export function useSDaiData(): LoadableData<DaiPotData> {
  const { data: readContractsData, error, isLoading } = useReadContracts<ContractCallBigIntResult>(readContractsParams)
  return useMemo<LoadableData<DaiPotData>>(() => {
    if (isLoading) {
      return { isLoading: true, error }
    }
    if (error) {
      console.error('dsr data error', error)
      return { error, isLoading: false }
    }
    const typedReadContractsData = readContractsData as ContractCallBigIntResult[]
    const dsr = unsafeConvertBigNumberToNumer(typedReadContractsData[0].result || 0)
    const chi = unsafeConvertBigNumberToNumer(typedReadContractsData[1].result || 0)
    const rho = unsafeConvertBigNumberToNumer(typedReadContractsData[2].result || 0)

    const apy = Math.pow(
      dsr / Math.pow(10, 27),
      60 * 60 * 24 * 365
    ) - 1
    const data = {
      apy,
      chi,
      rho
    }
    return { data, isLoading: false }
  }, [error, readContractsData, isLoading])
}
