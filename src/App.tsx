import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutReturn from './components/checkout/CheckoutReturnWrapper';
import OrderConfirmation from './pages/OrderConfirmation';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

function App() {
  return (
    <ToastProvider>
      <Router basename="/StreamingAccounts">
        <AuthProvider>
          <CartProvider>
          <Routes>
            {/* Auth routes without layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Main routes with layout */}
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/return" element={<CheckoutReturn />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  {/* Add more routes here as we create more pages */}
                </Routes>
              </Layout>
            } />
          </Routes>          </CartProvider>
        </AuthProvider>
      </Router>
    </ToastProvider>
  );
}

export default App;
