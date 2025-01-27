import getChainName from '@/utils/getChainName';
import styled from 'styled-components';

const platformIcons = {
  coinbase: "https://assets.coingecko.com/markets/images/23/large/Coinbase_Coin_Primary.png",
  binance: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  kraken: "https://assets.coingecko.com/markets/images/29/large/kraken.jpg",
  aave: "https://cryptologos.cc/logos/aave-aave-logo.png",
  morpho: "https://assets.coingecko.com/coins/images/29837/standard/Morpho-token-icon.png",
  beefy: "https://assets.coingecko.com/coins/images/12704/standard/bifi.png",
  dsr: "https://pbs.twimg.com/profile_images/1828469202753122304/i8YRkB4A_400x400.jpg",
  ssr: "https://pbs.twimg.com/profile_images/1828469202753122304/i8YRkB4A_400x400.jpg"
}

const tokenIcons = {
  USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  DAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  xDAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  WXDAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
  EURC: "https://assets.coingecko.com/coins/images/26045/standard/euro.png?1696525125",
  USDS: "https://img.cryptorank.io/coins/usds1724768606452.png"
}

const chainIcons = {
  1: "https://svgmix.com/uploads/3287b3-ethereum-eth.svg",
  56: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  137: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  100: "https://s1.coincarp.com/logo/1/gnosis-gno.png?style=200&v=1630481838",
  10: "https://cryptologos.cc/logos/optimism-ethereum-op-logo.png",
  42161: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
  324: "https://s2.coinmarketcap.com/static/img/coins/200x200/24091.png",
  534352: "https://scroll.io/_next/static/media/Scroll_Logomark.ad5d0348.svg",
  8453: "https://www.base.org/document/apple-touch-icon.png"
}

const platformNames = {
  coinbase: "Coinbase",
  binance: "Binance",
  kraken: "Kraken",
  aave: "Aave",
  morpho: "Morpho",
  beefy: "Beefy",
  dsr: "DAI Savings",
  ssr: "Sky Savings"
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
  overflow: hidden;
  white-space: nowrap;
  @media (max-width: 400px) {
    width: 15ch;
  }

  @media (max-width: 429px) {
    display: inline-block;
    width: 18ch;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const PlatformNameWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

interface PlatformParameters {
  platform: string;
  symbol: string;
  pool: string;
  chainId: number | undefined;
  type: string | undefined;
}

const PlatformDisplay = (params: PlatformParameters) => {
  const { platform, symbol, pool, chainId, type } = params
  const isSpot = type === 'spot' 
  const platformIconUrl = platformIcons[platform] || `https://placehold.co/32x32?text=${platform}`;
  const tokenIconUrl = tokenIcons[symbol] || `https://placehold.co/32x32?text=${symbol}`;
  const platformName = platformNames[platform] || platform || 'Unknown Platform';
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
          <PlatformName>{platformName}</PlatformName>
          {chainIconUrl && <ChainIcon src={chainIconUrl} alt={chainName} />}
        </PlatformNameWrapper>
        <PoolName>{pool || 'Spot'}</PoolName>
      </PlatformInfo>
    </PlatformWrapper>
  );
};
export default PlatformDisplay
