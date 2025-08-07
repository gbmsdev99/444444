import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Customize } from './pages/Customize';
import { Orders } from './pages/Orders';
import { Measurements } from './pages/Measurements';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';
import { Checkout } from './pages/Checkout';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
            },
          }}
        />
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
            <Route path="/checkout" element={<Checkout />} />
            <Route 
              path="/admin-dashboard-secret" 
              element={
                isAdmin ? <Admin /> : <Navigate to="/login" />
              } 
            />
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