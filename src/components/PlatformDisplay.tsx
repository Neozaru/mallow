import getChainName from '@/utils/getChainName';
import Link from 'next/link';
import styled from 'styled-components';
import { arbitrum, avalanche, base, bsc, gnosis, linea, mainnet, optimism, polygon, scroll, sonic, zksync } from 'viem/chains';

const platformIcons = {
  coinbase: "https://assets.coingecko.com/markets/images/23/large/Coinbase_Coin_Primary.png",
  binance: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  kraken: "https://assets.coingecko.com/markets/images/29/large/kraken.jpg",
  aave: "https://cryptologos.cc/logos/aave-aave-logo.png",
  morpho: "https://assets.coingecko.com/coins/images/29837/standard/Morpho-token-icon.png",
  beefy: "https://assets.coingecko.com/coins/images/12704/standard/bifi.png",
  dsr: "https://pbs.twimg.com/profile_images/1828469202753122304/i8YRkB4A_400x400.jpg",
  ssr: "https://pbs.twimg.com/profile_images/1828469202753122304/i8YRkB4A_400x400.jpg",
  pendle: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-dQOIOQMdZqULJmTErCR_UY-loP626kk_EA&s'
}

const tokenIcons = {
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  aUSDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  aUSDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  aUSDS: "https://img.cryptorank.io/coins/usds1724768606452.png",
  DAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  xDAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  WXDAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  EURC: "https://assets.coingecko.com/coins/images/26045/standard/euro.png?1696525125",
  USDS: "https://img.cryptorank.io/coins/usds1724768606452.png",
  GHO: "https://app.aave.com/icons/tokens/gho.svg",
}

const chainIcons = {
  [mainnet.id]: "https://svgmix.com/uploads/3287b3-ethereum-eth.svg",
  [bsc.id]: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  [polygon.id]: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  [gnosis.id]: "https://s1.coincarp.com/logo/1/gnosis-gno.png?style=200&v=1630481838",
  [optimism.id]: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  [arbitrum.id]: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  [zksync.id]: "https://s2.coinmarketcap.com/static/img/coins/200x200/24091.png",
  [scroll.id]: "https://scroll.io/_next/static/media/Scroll_Logomark.ad5d0348.svg",
  [base.id]: "https://www.base.org/document/apple-touch-icon.png",
  [sonic.id]: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGaBA0DvSfL6cqxtrHiTkyZBQMPK5KX7csPg&s",
  [avalanche.id]: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  [linea.id]: "https://images.seeklogo.com/logo-png/52/1/linea-logo-png_seeklogo-527155.png"
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
  pool: string;
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
  const { link, platform, symbol, pool, chainId, type } = params
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
            <PoolNameText>{pool || 'Spot'}</PoolNameText>
            {link && <ExternalLinkWrapper><ExternalLink href={link}/></ExternalLinkWrapper>}
          </PoolName>
        </PlatformInfo>
    </PlatformWrapper>
  );
};
export default PlatformDisplay
