import { gql } from 'graphql-request';

export const GET_VAULTS = gql`
  query GetVaults($where: VaultFilters) {
    vaults(where: $where) {
      items {
        chain {
          id
          network
        }
        asset {
          symbol
        }
        symbol
        warnings {
          level
          type
        }
        state {
          sharePriceNumber
          avgNetApyExcludingRewards
          avgNetApy
          allocation {
            market {
              collateralAsset {
                symbol
              }
            }
          }
        }
        id
        name
        address
        listed
      }
    }
  }
`
