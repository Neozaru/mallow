type EvmAddressInternal = `0x${string}`

type YieldOpportunityBase = {
  id: string;
  symbol: string;
  poolName: string;
  apy: number;
  metadata?: {
    link: string;
  }
}

type YieldOpportunityOnChain = YieldOpportunityBase & {
  id: string;
  poolTokenAddress: EvmAddressInternal;
  platform: 'spot' | 'aave' | 'morpho' | 'beefy' | 'dsr' | 'ssr';
  chainId: number;
  type: 'onchain';
}

type YieldOpportunityExchange = YieldOpportunityBase & {
  platform: 'kraken' | 'coinbase' | 'binance';
  type: 'exchange';
}

type YieldOpportunityManual = YieldOpportunityBase & {
  type: 'manual';
}

type PositionBalances = {
  balance: bigint;
  balanceUsd: number;
  formattedBalance: string;
}

type YieldPositionOnChain = YieldOpportunityOnChain & PositionBalances

type YieldPositionExchange = YieldOpportunityExchange & PositionBalances

type YieldPositionManual = YieldOpportunityManual & PositionBalances

type YieldPositionAny = YieldPositionOnChain | YieldPositionExchange | YieldPositionManual

type LoadableData<T> = {
  isLoading: boolean;
  data?: T;
  error?: any;
};

type TokenConfig = {
  address: EvmAddressInternal;
  chainId: number;
}

type ContractCallBigIntResultOk = {
  result: bigint;
  status: 'success';
}

type ContractCallBigIntError = {
  status: 'failure';
  error: any;
}

type ContractCallBigIntResult = ContractCallBigIntResultOk | ContractCallBigIntResultError

