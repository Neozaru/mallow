import { gql } from 'graphql-request';

export const GET_VAULTS = gql`
  query GetVaults($where: VaultFilters) {
    vaults(where: $where) {
      items {
        chain {
          id
          network
        }
        dailyApys {
          netApy
          apy
        }
        monthlyApys {
          netApy
          apy
        }
        weeklyApys {
          netApy
          apy
        }
        asset {
          symbol
        }
        symbol
        warnings {
          level
          type
        }
        riskAnalysis {
          score
          isUnderReview
        }
        state {
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
        whitelisted
      }
    }
  }
`
