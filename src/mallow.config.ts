import { Address } from 'viem'
import { arbitrum, base, gnosis, mainnet, optimism, scroll, zksync, polygon, avalanche, linea, sonic, Chain, bsc } from 'viem/chains'

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
  sonic
] as [Chain, ...Chain[]]

type ChainId = (typeof enabledChains[number])['id']

type RiskAlgo = 'avg' | 'max' | 'weighted'

type MallowConfig = {
  enabledChains: readonly [Chain, ...Chain[]];
  chains: { [c in ChainId]: ChainConfig };
  mallowContractAddresses: { [c in ChainId]: { manager: Address } };
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
      rpcUrl: process.env.NEXT_PUBLIC_MAINNET_URL,
    },
    [optimism.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_OPTIMISM_URL,
    },
    [arbitrum.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_ARBITRUM_URL,
    },
    [scroll.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_SCROLL_URL,
    },
    [zksync.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_ZKSYNC_URL,
    },
    [gnosis.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_GNOSIS_URL,
    },
    [base.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_BASE_URL,
    },
    [polygon.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_POLYGON_URL,
    },
    [sonic.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_SONIC_URL,
    },
    [avalanche.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_AVALANCHE_URL,
    },
    [bsc.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_BNB_URL,
    },
    [linea.id]: {
      rpcUrl: process.env.NEXT_PUBLIC_LINEA_URL,
    }
  },
  mallowContractAddresses: {
    [base.id]: {
      // manager: '0x4E00a24d7A6CF315EBc631A612E56a4037B0EE57'
      manager: '0xD89F7f0cB4B122123755A3EF0d43c7015A747FB6' // With spot
      // manager: '0x71E9Bf1e3cdfEB5f72E15164d1c59B571F279a85' all ERC
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
      [bsc.id]: 1
    },
    protocols: {
      spot: 0,
      aave: 0,
      morpho: 1,
      beefy: 2,
      dsr: 1,
      ssr: 2,
      pendle: 2
    },
    symbols: {
      AUSDC: 1,
      AUSDT: 1,
      ADAI: 1,
      AUSDS: 2,
      USDC: 0,
      EURC: 0,
      USDT: 1,
      DAI: 1,
      XDAI: 1,
      WXDAI: 1,
      USDS: 1,
      GHO: 1,
      STKGHO: 2
    }
  }
}

export default mallowConfig
