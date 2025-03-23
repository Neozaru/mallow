export function formatApy(apy: number | null | undefined): string {
  return `${((apy || 0) * 100).toFixed(2)}%`;
}
