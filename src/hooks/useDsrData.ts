import { useEffect, useState } from 'react';
import { mainnet } from 'viem/chains';
import { useReadContracts } from 'wagmi';

// TODO: Move
const potAbi = [{"inputs":[{"internalType":"address","name":"vat_","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"constant":true,"inputs":[],"name":"Pie","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"cage","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"chi","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"drip","outputs":[{"internalType":"uint256","name":"tmp","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"dsr","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"uint256","name":"data","type":"uint256"}],"name":"file","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"what","type":"bytes32"},{"internalType":"address","name":"addr","type":"address"}],"name":"file","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"join","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"live","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pie","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"guy","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rho","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"vat","outputs":[{"internalType":"contract VatLike","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"vow","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
const potContractAddress = '0x197E90f9FAD81970bA7976f33CbD77088E5D7cf7'

const contractCalls = [{
  address: potContractAddress,
  abi: potAbi,
  functionName: 'dsr',
  args: [],
  chainId: mainnet.id
}, {
  address: potContractAddress,
  abi: potAbi,
  functionName: 'chi',
  args: [],
  chainId: mainnet.id
}, {
  address: potContractAddress,
  abi: potAbi,
  functionName: 'rho',
  args: [],
  chainId: mainnet.id
}]

export function useSDaiData() {
  const [sDaiData, setSDaiData] = useState({ apy: 0, rho: 0, chi: 0 })
  const { data, error, isLoading } = useReadContracts({
    contracts: contractCalls
  })
  
  useEffect(() => {
    if (error) {
      console.error('dsr data error', error)
      throw Error('sDAI Data error', error)
    }
    if (!data || data.length === 0) {
      return
    }

    const dsr = parseInt(data[0].result)
    const chi = parseInt(data[1].result)
    const rho = parseInt(data[2].result)

    const apy = Math.pow(
      dsr / Math.pow(10, 27),
      60*60*24*365
    ) - 1
    setSDaiData({ apy, chi, rho })
  }, [error, data])

  return sDaiData
}
