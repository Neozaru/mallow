import styled from 'styled-components';

const LogoWrapper = styled.div`
  text-align: center;
`;

const Logo = styled.img`
  margin: auto;
`

const MallowLogo = () => {
  return (
    <LogoWrapper>
      <Logo src='/mallowLogoWhiteTransparentBackground.svg' alt='Mallow Logo' />
    </LogoWrapper>
  )
}

export default MallowLogo
