import { formatApy } from '@/lib/formatApy';
import styled from 'styled-components';

const ApyCellWrapper = styled.div`
`

const Apy = styled.div`
  font-weight: bold;
  text-align: right;
`

const Expiry = styled.div`
  font-size: 13px;
  color: #b4b0c4;
  text-align: right;
`;

type Props = {
  apy: number;
  expiry?: Date;
}

const ApyCell = ({ apy, expiry }: Props) => {
  return <ApyCellWrapper>
    <Apy>{formatApy(apy)}</Apy>
    {expiry && <Expiry>⏱ {expiry.toLocaleString('en-US', { month: 'short', day: 'numeric' })}</Expiry>}
  </ApyCellWrapper>
}

export default ApyCell
