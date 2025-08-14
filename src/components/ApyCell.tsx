import { formatApy } from '@/lib/formatApy';
import styled from 'styled-components';

const ApyCellWrapper = styled.div`
`

const Apy = styled.div`
  font-weight: bold;
  text-align: right;
`

const Expiry = styled.div<{ isexpired: boolean }>`
  font-size: 13px;
  color: ${props => props.isexpired ? 'red' : '#b4b0c4'};
  text-align: right;
`;

type Props = {
  apy: number;
  expiry?: Date;
}

const today = new Date()

const ApyCell = ({ apy, expiry }: Props) => {
  return <ApyCellWrapper>
    <Apy>{formatApy(apy)}</Apy>
    {expiry && <Expiry isexpired={today >= expiry}>⏱ {expiry.toLocaleString('en-US', { month: 'short', day: 'numeric' })}</Expiry>}
  </ApyCellWrapper>
}

export default ApyCell
