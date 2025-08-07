import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Customize } from './pages/Customize';
import { Orders } from './pages/Orders';
import { Measurements } from './pages/Measurements';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { useStore } from './store/useStore';

function App() {
  const { user } = useStore();

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/customize/:productId" element={<Customize />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' ? <Admin /> : <Navigate to="/login" />
              } 
            />
            <Route path="/checkout" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-slate-800 mb-4">Checkout</h2>
                  <p className="text-slate-600 mb-8">Payment integration will be implemented here</p>
                  <p className="text-sm text-slate-500">Stripe/Razorpay integration ready</p>
                </div>
              </div>
            } />
            <Route path="/profile" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-slate-800 mb-4">User Profile</h2>
                  <p className="text-slate-600">Profile management coming soon</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;