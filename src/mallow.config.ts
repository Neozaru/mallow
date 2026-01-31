import { Address } from 'viem'
import { arbitrum, base, gnosis, mainnet, optimism, scroll, zksync, polygon, avalanche, linea, sonic, Chain, bsc, fraxtal, mantle, berachain, metis, rootstock, sei, celo, unichain, plasma } from 'viem/chains'
import { env } from 'next-runtime-env'

type ChainConfig = {
  rpcUrl?: string
}

const enabledChains = [
  mainnet, 
  optimism, 
  arbitrum, 
  scroll,
  base, 
  zksync, 
  gnosis, 
  polygon, 
  avalanche, 
  linea,
  bsc,
  sonic,
  fraxtal,
  mantle,
  berachain,
  metis,
  rootstock,
  sei,
  celo,
  unichain,
  plasma
] as [Chain, ...Chain[]]

type ChainId = (typeof enabledChains[number])['id']

type RiskAlgo = 'avg' | 'max' | 'weighted'

type MallowConfig = {
  enabledChains: readonly [Chain, ...Chain[]];
  chains: { [c in ChainId]: ChainConfig };
  mallowContractAddresses: { [c in ChainId]: { manager: Address, bridgeHandler: Address } };
  risks: {
    algo: RiskAlgo;
    defaults: {
      chains: number;
      protocols: number;
      symbols: number;
    };
    chains: { [chainId: number]: RiskValue };
    protocols: { [protocol: string]: RiskValue };
    symbols: { [symbol: string]: RiskValue };
  }
}

const mallowConfig: MallowConfig = {
  enabledChains,
  chains: {
    [mainnet.id]: {
      rpcUrl: env('NEXT_PUBLIC_MAINNET_URL'),
    },
    [optimism.id]: {
      rpcUrl: env('NEXT_PUBLIC_OPTIMISM_URL'),
    },
    [arbitrum.id]: {
      rpcUrl: env('NEXT_PUBLIC_ARBITRUM_URL'),
    },
    [scroll.id]: {
      rpcUrl: env('NEXT_PUBLIC_SCROLL_URL'),
    },
    [zksync.id]: {
      rpcUrl: env('NEXT_PUBLIC_ZKSYNC_URL'),
    },
    [gnosis.id]: {
      rpcUrl: env('NEXT_PUBLIC_GNOSIS_URL'),
    },
    [base.id]: {
      rpcUrl: env('NEXT_PUBLIC_BASE_URL'),
    },
    [polygon.id]: {
      rpcUrl: env('NEXT_PUBLIC_POLYGON_URL'),
    },
    [sonic.id]: {
      rpcUrl: env('NEXT_PUBLIC_SONIC_URL'),
    },
    [avalanche.id]: {
      rpcUrl: env('NEXT_PUBLIC_AVALANCHE_URL'),
    },
    [bsc.id]: {
      rpcUrl: env('NEXT_PUBLIC_BNB_URL'),
    },
    [linea.id]: {
      rpcUrl: env('NEXT_PUBLIC_LINEA_URL'),
    },
    [fraxtal.id]: {
      rpcUrl: env('NEXT_PUBLIC_FRAX_URL'),
    },
    [mantle.id]: {
      rpcUrl: env('NEXT_PUBLIC_MANTLE_URL'),
    },
    [berachain.id]: {
      rpcUrl: env('NEXT_PUBLIC_BERACHAIN_URL'),
    },
    [metis.id]: {
      rpcUrl: env('NEXT_PUBLIC_METIS_URL'),
    },
    [rootstock.id]: {
      rpcUrl: env('NEXT_PUBLIC_ROOTSTOCK_URL'),
    },
    [sei.id]: {
      rpcUrl: env('NEXT_PUBLIC_SEI_URL'),
    },
    [celo.id]: {
      rpcUrl: env('NEXT_PUBLIC_CELO_URL'),
    },
    [unichain.id]: {
      rpcUrl: env('NEXT_PUBLIC_UNICHAIN_URL'),
    },
    [plasma.id]: {
      rpcUrl: env('NEXT_PUBLIC_PLASMA_URL'),
    },
  },
  mallowContractAddresses: {
    [base.id]: {
      // manager: '0x4E00a24d7A6CF315EBc631A612E56a4037B0EE57'
      // manager: '0xD89F7f0cB4B122123755A3EF0d43c7015A747FB6' // With spot
      // manager: '0x71E9Bf1e3cdfEB5f72E15164d1c59B571F279a85' all ERC
      manager: '0x4C3a38e4bd4F071C0D8B952B81fd19A1Ff57b5bf',
      bridgeHandler: '0x7052E4379026a4C98207A78F1d57B1D69dCB1a4e'
    },
    [arbitrum.id]: {
      manager: '0x053a5478A7e6627939B366189361bBEfA9Cc94d1',
      bridgeHandler: '0x3DdDC12bc69a0fA74507F2F1c95176938446F7fA'
    }
  },
  risks: {
    algo: 'max',
    defaults: {
      chains: 2,
      protocols: 3,
      symbols: 3
    },
    chains: {
      [mainnet.id]: 0,
      [optimism.id]: 1,
      [base.id]: 1,
      [arbitrum.id]: 1,
      [scroll.id]: 2,
      [zksync.id]: 2,
      [gnosis.id]: 1,
      [polygon.id]: 2,
      [sonic.id]: 2,
      [avalanche.id]: 2,
      [linea.id]: 2,
      [bsc.id]: 1,
      [mantle.id]: 2,
      [fraxtal.id]: 1
    },
    protocols: {
      spot: 0,
      aave: 0,
      morpho: 1,
      beefy: 2,
      dsr: 1,
      ssr: 1,
      pendle: 2
    },
    symbols: {
      EURE: 1,
      AUSDC: 1,
      AUSDT: 1,
      ADAI: 1,
      AUSDS: 2,
      USDC: 0,
      EURC: 0,
      USDT: 1,
      USDT0: 1,
      'USD₮0': 1,
      DAI: 1,
      SDAI: 1,
      XDAI: 1,
      WXDAI: 1,
      USDS: 1,
      GHO: 1,
      STKGHO: 2,
      STKAGHO: 2,
      STKAUSDC: 2,
      STKAUSDT: 2,
      STKAUSDT0: 2,
      PTAUSDT0: 2,
    }
  }
}

export default mallowConfig
