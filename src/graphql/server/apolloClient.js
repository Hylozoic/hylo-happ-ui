import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import apolloLogger from 'apollo-link-logger'
import { SchemaLink } from 'apollo-link-schema'
import { RetryLink } from 'apollo-link-retry'
import { InMemoryCache } from 'apollo-cache-inmemory'
import HyloHappInterfaceLoaders from 'data-interfaces/HyloHappInterfaceLoaders'
import schema from 'graphql/server'

function schemaContext () {
  return {
    HyloHappInterfaceLoaders: HyloHappInterfaceLoaders()
  }
}

const link = ApolloLink.from([
  apolloLogger,
  new RetryLink(),
  new SchemaLink({ schema, context: schemaContext })
])

const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true
})

export default apolloClient
