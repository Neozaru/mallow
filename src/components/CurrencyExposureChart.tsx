import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ["#818cf8", "#34d399", "#c084fc", "#38bdf8", "#f472b6"];
const renderTooltip = (value) => `$${value.toLocaleString()}`;

const CurrencyExposureChart = ({ positions } : { positions: YieldPositionAnyWithCurrencyInfo[] }) => {
  const currencyPieChartData = useMemo(() => {
    const data = positions.reduce((acc, position) => {
      const existing = acc.find(item => item.currency === position.currency)
      if (existing) {
        existing.value += position.balanceUsd
      } else {
        acc.push({
          currency: position.currency,
          value: position.balanceUsd
        })
      }
      return acc
    }, [] as { currency: string, value: number }[])
    return data.filter(item => item.value > 0)
  }, [positions])

  return (
    <div className='flex flex-row justify-center'>
      <PieChart width={300} height={300}>
        <Pie
          data={currencyPieChartData}
          dataKey="value"
          nameKey="currency"
          cx="50%"
          cy="50%"
          outerRadius={130}
        >
          {currencyPieChartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => renderTooltip(value)} />
        <Legend />
    </PieChart>
  </div>)
}

export default CurrencyExposureChart