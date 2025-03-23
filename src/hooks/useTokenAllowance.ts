import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';


const useTokenAllowance = ({ tokenAddress, ownerAddress, spenderAddress, chainId }) => useReadContract({
  abi: erc20Abi,
  address: tokenAddress,
  chainId,
  functionName: 'allowance',
  args: [ ownerAddress, spenderAddress]
})

export default useTokenAllowance
