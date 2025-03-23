import { formatApy } from '@/lib/formatApy';
import styled from 'styled-components';

const ApyWapper = styled.div`
  font-weight: bold;
  text-align: right;
`

const ApyCell = ({ apy }) => {
  return <ApyWapper>{formatApy(apy)}</ApyWapper>
}

export default ApyCell
