import styled, { keyframes } from 'styled-components';

const LoadingWrapper = styled.div`
  font-size: 24px;
  text-align: center;
  padding-top: 40px;
`;

const wobbleSquish = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.1, 0.9) rotate(-10deg);
  }
  50% {
    transform: scale(0.9, 1.1) rotate(10deg);
  }
  75% {
    transform: scale(1.05, 0.95) rotate(-5deg);
  }
`;

const LoadingLogo = styled.img`
  margin: auto;
  animation: ${wobbleSquish} 1.5s infinite ease-in-out;
`

const LoadingSpinner = () => {
  return (<LoadingWrapper>
    <LoadingLogo src='/mallowLogoWhiteTransparentBackground.svg' alt=''/>
    <div>Loading...</div>
  </LoadingWrapper>)
}

export default LoadingSpinner
