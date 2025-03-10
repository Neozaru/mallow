import styled from 'styled-components';

const riskTexts = ['🟢', '🟡', '🟠', '🔴'];

const RiskSpan = styled.span`
  display: flex;
`;


const RiskCell = ({ risk }) => {
  return <RiskSpan>{riskTexts[risk] || 'Unknown'}</RiskSpan>;
}

export default RiskCell
