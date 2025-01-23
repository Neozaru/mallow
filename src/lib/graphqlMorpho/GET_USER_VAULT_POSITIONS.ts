
export const GET_USER_VAULT_POSITIONS = `
  query ExampleQuery($userAddress: String!) {
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
          asset {
            symbol
          }
          chain {
            id
          }
          dailyApys {
            netApy
          }
        }
      } 
    }
  }
`
