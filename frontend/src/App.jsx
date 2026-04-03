import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';
import ComingSoon from './pages/ComingSoon';
import Account from './pages/Account';
import CustomerService from './pages/CustomerService';
import Registry from './pages/Registry';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/account" element={<Account />} />
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/registry" element={<Registry />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} /> {/* Admin Route */}
          </Routes>
        </main>
        <footer className="bg-slate-900 text-white p-8 mt-12">
            <div className="container mx-auto text-center">
                <p>&copy; 2026 EmoStore. All rights reserved.</p>
                <p className="text-gray-400 text-sm mt-2">Your premium shopping destination.</p>
            </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
