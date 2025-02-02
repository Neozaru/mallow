
type YieldPosition = {
  protocol: number;
  symbol: number;
  balance: number;
  poolName: string;
  formattedBalance: string;
  balanceUsd: number;
  type: string;
  apy: number;
}

type YieldOpportunity = {
  id: string;
  symbol: string;
  poolTokenAddress: string;
  protocol: 'aave' | 'morpho' | 'beefy' | 'dsr' | 'spot';
  poolName: string;
  chainId: number;
  apy: number;
  type: 'dapp' | 'exchange'; // TODO: Change name of property
}

