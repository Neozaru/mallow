import React from 'react'
import GaugeChart from 'react-gauge-chart'

type Props = {
  risk: RiskValue;
}

const riskLevels = [
  { label: 'S', color: '#4CAF50' }, // Safe
  { label: 'L', color: '#d4f542' }, // Low
  { label: 'M', color: '#FF9800' }, // Medium
  { label: 'H', color: '#F44336' }, // High
]

const RiskGauge = React.memo<Props>(({ risk }) => {
  const gaugeStyle = {
    width: '100%',
    height: '48px',
  }

  const colors = riskLevels.map((level, index) =>
    index === risk ? level.color : '#CCCCCC'
  )

  const arcsLength = riskLevels.map((_, index) =>
    index === risk ? 0.25 : 0.25
  )

  return (
    <div style={{ position: 'relative', width: '48px', height: '48px' }}>
      <GaugeChart
        id="risk-gauge-chart"
        nrOfLevels={4}
        arcsLength={arcsLength}
        colors={colors}
        percent={(risk + 1) / 4}
        arcPadding={0.02}
        cornerRadius={3}
        style={gaugeStyle}
        textColor="none"
        needleColor="transparent"
        needleBaseColor="transparent"
        hideText={false}
        animate={false}
        formatTextValue={() => riskLevels[risk].label}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '12px',
          fontWeight: 'bold',
          color: colors[risk],
        }}
      >
        {riskLevels[risk].label}
      </div>
    </div>
  )
})

RiskGauge.displayName = 'RiskGauge'

export default RiskGauge
