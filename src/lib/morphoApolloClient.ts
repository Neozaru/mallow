import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

const createMorphoApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://blue-api.morpho.org/graphql',
    }),
    cache: new InMemoryCache(),
  })
}

export default createMorphoApolloClient;
