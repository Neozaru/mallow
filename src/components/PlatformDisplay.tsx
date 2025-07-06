import getChainName from '@/utils/getChainName';
import { tokenLogo } from '@/utils/logosUtils';
import Link from 'next/link';
import styled from 'styled-components';
import { arbitrum, avalanche, base, bsc, gnosis, linea, mainnet, optimism, polygon, scroll, sei, sonic, zksync } from 'viem/chains';

const platformIcons = {
  coinbase: "https://assets.coingecko.com/markets/images/23/large/Coinbase_Coin_Primary.png",
  binance: "logos/platforms/binance.png",
  kraken: "https://assets.coingecko.com/markets/images/29/large/kraken.jpg",
  aave: "/logos/platforms/aave.png",
  morpho: "https://assets.coingecko.com/coins/images/29837/standard/Morpho-token-icon.png",
  beefy: "https://assets.coingecko.com/coins/images/12704/standard/bifi.png",
  dsr: "https://pbs.twimg.com/profile_images/1828469202753122304/i8YRkB4A_400x400.jpg",
  ssr: "https://pbs.twimg.com/profile_images/1828469202753122304/i8YRkB4A_400x400.jpg",
  pendle: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-dQOIOQMdZqULJmTErCR_UY-loP626kk_EA&s'
}

const tokenIcons = {
  USDC: tokenLogo('usdc.png'),
  USDT: tokenLogo('usdt.png'),
  aUSDC: tokenLogo('usdc.png'),
  aUSDT: tokenLogo('usdt.png'),
  aUSDS: tokenLogo('usds.png'),
  DAI: tokenLogo('dai.png'),
  xDAI: tokenLogo('dai.png'),
  WXDAI: tokenLogo('dai.png'),
  EURC: tokenLogo('eurc.webp'),
  USDS: tokenLogo('usds.png'),
  GHO: tokenLogo('gho.png'),
  aGHO: tokenLogo('gho.png'),
  stkGHO: tokenLogo('gho.png'),
}

const chainIcons = {
  [mainnet.id]: "https://svgmix.com/uploads/3287b3-ethereum-eth.svg",
  [bsc.id]: "/logos/networks/bnb.png",
  [polygon.id]: "logos/networks/polygon.png",
  [gnosis.id]: "https://s1.coincarp.com/logo/1/gnosis-gno.png?style=200&v=1630481838",
  [optimism.id]: "/logos/networks/op.png",
  [arbitrum.id]: "/logos/networks/arbitrum.png",
  [zksync.id]: "https://s2.coinmarketcap.com/static/img/coins/200x200/24091.png",
  [scroll.id]: "https://scroll.io/_next/static/media/Scroll_Logomark.ad5d0348.svg",
  [base.id]: "https://www.base.org/document/apple-touch-icon.png",
  [sonic.id]: "https://s2.coinmarketcap.com/static/img/coins/200x200/32684.png",
  [avalanche.id]: "/logos/networks/avalanche.png",
  [linea.id]: "https://images.seeklogo.com/logo-png/52/1/linea-logo-png_seeklogo-527155.png",
  [sei.id]: "https://blog.sei.io/content/images/size/w100/2022/08/Sei-logo-only-6.png"
}

const platformNames = {
  coinbase: "Coinbase",
  binance: "Binance",
  kraken: "Kraken",
  aave: "Aave",
  morpho: "Morpho",
  beefy: "Beefy",
  dsr: "DSR",
  ssr: "Sky Savings",
  pendle: "Pendle",
}

const PlatformWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const TokenWrapper = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
`;

const TokenIcon = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const ChainIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 8px;
  border-radius: 4px;
  object-fit: cover;
  align-self: center;
`;

const PlatformIcon = styled.img`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
  background-color: white;
`;

const PlatformInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlatformName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: white;
`;

const PoolName = styled.div`
  font-size: 13px;
  color: #b4b0c4;
  display: flex;
  align-items: center;
`;

const PoolNameText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 431px) {
    display: inline-block;
    max-width: 15ch;
  }

  @media (max-width: 400px) {
    display: inline-block;
    max-width: 13ch;
  }

  min-width: 0;
  flex: 0 1 auto;
  margin-right: 5px;
`

const PlatformNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const ExternalLinkWrapper = styled.span`
  flex: none;
`

interface PlatformParameters {
  symbol: string;
  type: string | undefined;
  poolName: string;
  chainId?: number;
  link?: string;
  platform?: string;
}

function ExternalLink({ href }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      ↗
    </Link>
  );
}

const PlatformDisplay = (params: PlatformParameters) => {
  const { link, platform, symbol, poolName, chainId, type } = params
  const isSpot = platform === 'spot'
  const isManual = type === 'manual'
  const platformIconUrl = platform && platformIcons[platform] || `https://placehold.co/32x32?text=${platform}`;
  const tokenIconUrl = tokenIcons[symbol.split('.')[0]] || `https://placehold.co/32x32?text=${symbol}`;
  const platformName = isManual ? symbol : platform && platformNames[platform] || platform || 'Unknown Platform';
  const chainName = chainId ? getChainName(chainId) : ''
  const chainIconUrl = chainId
    ? chainIcons[chainId] || `https://placehold.co/12x12?text=${chainName}`
    : undefined

  return (
    <PlatformWrapper>
        <TokenWrapper>
          <TokenIcon src={tokenIconUrl} alt={symbol} />
          {!isSpot && <PlatformIcon src={platformIconUrl} alt={platform} />}
        </TokenWrapper>
        <PlatformInfo>
          <PlatformNameWrapper>
            <PlatformName>{isSpot ? symbol : platformName}</PlatformName>
            {chainIconUrl && <ChainIcon src={chainIconUrl} alt={chainName} />}
          </PlatformNameWrapper>
          <PoolName>
            <PoolNameText>{poolName || 'Spot'}</PoolNameText>
            {link && <ExternalLinkWrapper><ExternalLink href={link}/></ExternalLinkWrapper>}
          </PoolName>
        </PlatformInfo>
    </PlatformWrapper>
  );
};
export default PlatformDisplay
