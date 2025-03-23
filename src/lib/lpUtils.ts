
const PRECISION = BigInt(1_000_000_000_000_000_000)
const ONE = BigInt(1)

export function sharesToBaseNR(sharesAmount: bigint, sharePrice: bigint) {
  return (sharesAmount * BigInt(sharePrice)) / PRECISION
}

export function sharesToBase(sharesAmount: bigint, sharePrice: bigint) {
  return (sharesAmount * BigInt(sharePrice) + PRECISION - ONE) / PRECISION
}

export function baseToShares(baseAmount: bigint, sharePrice: bigint) {
  return (baseAmount * PRECISION) / sharePrice;
}
