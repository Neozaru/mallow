import { gql } from 'graphql-request';

export const GET_USER_VAULT_POSITIONS = gql`
  query GetUserVaultPositions($userAddress: String!) {
    userByAddress(address: $userAddress, chainId: null) {
      address
      vaultPositions {
        assets,
        assetsUsd,
        id,
        shares
        vault {
          id,
          name,
          symbol,
          address,
          asset {
            symbol
          }
          chain {
            id
            network
          }
          dailyApys {
            netApy
          }
        }
      } 
    }
  }
`
