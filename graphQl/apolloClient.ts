import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  DefaultOptions,
  createHttpLink,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  headers: {
    Authorization: `Apikey ${process.env.NEXT_PUBLIC_STEPZEN_API_KEY}`,
  },
  fetch,
});
// console.log("StepZen API KEY:", process.env.NEXT_PUBLIC_STEPZEN_API_KEY);

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
  mutate: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions,
});

export default client;
