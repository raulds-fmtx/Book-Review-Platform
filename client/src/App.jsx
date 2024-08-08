import '../../client/src/App.jsx';
import { Outlet } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import checkoutPage from './pages/checkoutPage.jsx';
import Navbar from './components/Navbar';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/donation" element={checkoutPage}/>
    //   </Routes>
    // </Router>
    <Elements stripe={stripePromise}>
    <Navbar />
    <Outlet />
  </Elements>
  );
}

export default App;