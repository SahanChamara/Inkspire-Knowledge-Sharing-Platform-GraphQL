import { InMemoryCache } from "@apollo/client";
import { ApolloClient, split } from "@apollo/client";
import { HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";



const httpUrl = import.meta.env.VITE_GRAPHQL_HTTP;
const wsUrl = import.meta.env.VITE_GRAPHQL_WS;

const httpLink = new HttpLink({
    uri: httpUrl,
});

const wsLink = new GraphQLWsLink(createClient({
    url: wsUrl,
    connectionParams: () => {
        const token = localStorage.getItem("inkspire_token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
}));

const splitLink = split(
    ({query}) => {
        const def = getMainDefinition(query);
        return def.kind === "OperationDefinition" && def.operation === "subscription";
    },
    wsLink,
    httpLink,
);

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getWriters: {merge(existing, incoming) {return incoming} },
                    articles: {merge(existing = [], incoming) {return incoming}}
                }
            }
        }
    })
})