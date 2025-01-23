import { formatUnits } from 'viem';

const tokenDecimals = {
  'USDT': 6,
  'USDC': 6,
  'DAI': 18,
  'EURC': 6
}

export function formatBalanceWithSymbol(balance: bigint, symbol: string) {
  return formatUnits(balance, tokenDecimals[symbol] || 18)
}
