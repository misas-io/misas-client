import ApolloClient, { createNetworkInterface } from 'apollo-client';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: process.env.CLIENT_URL,
    /*
    opts: {
      credentials: 'same-origin',
    },
    */
  }),
});

export function getClient(): ApolloClient {
  return client;
};
