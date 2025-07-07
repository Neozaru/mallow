import stablecoins from '@/constants/stablecoins'

export function isStablecoin(symbol: string): boolean {
  return stablecoins.map(s => s.toLowerCase()).includes(symbol.toLowerCase())
}
