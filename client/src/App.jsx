import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { Outlet } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(stripePublicKey);

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Elements stripe={stripePromise}>
        <Navbar />
        <Outlet />
      </Elements>
    </ApolloProvider>
  );
}

export default App;