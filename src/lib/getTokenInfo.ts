import { Address } from 'viem'
import { getTokenDecimals } from './getTokenDecimals'


export default function getTokenInfo(symbol: string, address: Address): TokenInfo {
  return {
    symbol,
    address,
    decimals: getTokenDecimals(symbol)
  }
}
