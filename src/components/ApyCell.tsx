import styled from 'styled-components';

const ApyWapper = styled.div`
  font-weight: bold;
  text-align: right;
`

const ApyCell = ({ apy }) => {
  return <ApyWapper>{((apy || 0) * 100).toFixed(2)}%</ApyWapper>
}

export default ApyCell
