// Copyright GPT-5

// Input object uses Binance field names.
export interface SimpleEarnFlexiblePosition {
  totalAmount: number | string;
  latestAnnualPercentageRate: number | string;                 // base APR (decimal)
  tierAnnualPercentageRate?: Record<string, number | string>;  // e.g. { "0-100000USDC": "0.10000000" }
}

// Returns APY (decimal). Daily compounding by default.
export function computeBinanceEffectiveApy(
  { totalAmount, latestAnnualPercentageRate, tierAnnualPercentageRate = {} }: SimpleEarnFlexiblePosition
): number {
  const amount = typeof totalAmount === "number" ? totalAmount : parseFloat(String(totalAmount ?? 0));
  if (!amount) return 0;
  const baseApr = typeof latestAnnualPercentageRate === "number"
    ? latestAnnualPercentageRate
    : parseFloat(String(latestAnnualPercentageRate ?? 0));

  const tiers = Object.entries(tierAnnualPercentageRate)
    .map(([label, aprVal]) => {
      const nums = label.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
      const min = label.trim().startsWith("-") ? 0 : nums[0] ?? 0;           // "-10000ASSET"
      const max = label.trim().endsWith("-") ? Infinity : nums[1] ?? Infinity; // "10000ASSET-"
      const tierApr = typeof aprVal === "number" ? aprVal : parseFloat(String(aprVal));
      return { min, max, tierApr };
    })
    .sort((a, b) => a.min - b.min);

  let remaining = amount, covered = 0, aprAmountSum = 0;

  for (const t of tiers) {
    const start = Math.max(covered, t.min);
    const chunk = Math.max(0, Math.min(remaining, t.max - start));
    if (!chunk) continue;
    aprAmountSum += chunk * (baseApr + t.tierApr); // base + tier
    remaining -= chunk;
    covered = start + chunk;
    if (!remaining) break;
  }

  return (aprAmountSum + remaining * baseApr) / amount;
}

export default computeBinanceEffectiveApy
