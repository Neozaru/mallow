"use client";

import React, { useEffect, useState } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { mainnet } from 'viem/chains';


type TokenBalanceProps = {
  tokenAddress: `0x${string}`;
  accountAddress: `0x${string}`;
  tokenDecimals: number;
  chainId?: number;
};

const TokenBalance: React.FC<TokenBalanceProps> = ({ tokenAddress, tokenDecimals, accountAddress, chainId = mainnet.id }) => {
  const [formattedBalance, setFormattedBalance] = useState<string>('');

  const { data, error, isLoading } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [accountAddress],
    chainId
  });

  useEffect(() => {
    if (data) {
      const balance = formatUnits(data, tokenDecimals); // Adjust decimals as necessary
      setFormattedBalance(balance);
    }
  }, [data, tokenDecimals]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching balance: {error.message}</p>;

  return (
    <div>
      <p>Token Balance: {formattedBalance} tokens</p>
    </div>
  );
};

export default TokenBalance;
