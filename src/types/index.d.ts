type EvmAddressInternal = `0x${string}`

type YieldOpportunityBase = {
  id: string;
  symbol: string;
  protocol: 'aave' | 'morpho' | 'beefy' | 'dsr' | 'ssr' | 'kraken' | 'spot' | 'manual';
  poolName: string;
  apy: number;
  type: 'dapp' | 'exchange' | 'spot' | 'manual';
  metadata?: {
    link: string;
  }
}

type YieldOpportunityOnChain = YieldOpportunityBase & {
  id: string;
  poolTokenAddress: EvmAddressInternal;
  chainId: number;
  type: 'dapp' | 'spot'
}

type YieldOpportunityExchange = YieldOpportunityBase & {
  type: 'exchange'
}

type YieldOpportunity = YieldOpportunityExchange | YieldOpportunityOnChain

type PositionBalances = {
  balance: bigint;
  balanceUsd: number;
  formattedBalance: string;
}

type YieldPositionBase = YieldOpportunityBase & PositionBalances

type YieldPositionOnChain = YieldOpportunityOnChain & PositionBalances

type YieldPositionExchange = YieldOpportunityExchange & PositionBalances

type YieldPositionManual = YieldOpportunityBase & PositionBalances

type YieldPosition = YieldPositionOnChain | YieldPositionExchange | YieldPositionManual

type LoadableData<T> = {
  isLoading: boolean;
  data?: T;
  error?: any;
};

type TokenConfig = {
  address: EvmAddressInternal;
  chainId: number;
}
