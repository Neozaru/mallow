import { useEffect, useState } from 'react';
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

export function useSDaiData() {
  const [sDaiData, setSDaiData] = useState({ apy: 0, rho: 0, chi: 0 })
  const { data, error } = useReadContracts<ContractCallBigIntResult>(readContractsParams)
  
  useEffect(() => {
    if (error) {
      console.error('dsr data error', error)
      throw Error('sDAI Data error', error)
    }
    if (!data || data.length === 0) {
      return
    }
    const typedData = data as ContractCallBigIntResult[]
    const dsr = unsafeConvertBigNumberToNumer(typedData[0].result || 0)
    const chi = unsafeConvertBigNumberToNumer(typedData[1].result || 0)
    const rho = unsafeConvertBigNumberToNumer(typedData[2].result || 0)

    const apy = Math.pow(
      dsr / Math.pow(10, 27),
      60 * 60 * 24 * 365
    ) - 1
    setSDaiData({ apy, chi, rho })
  }, [error, data])

  return sDaiData
}
