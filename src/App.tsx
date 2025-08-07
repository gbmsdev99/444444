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
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Profile Page Component
const ProfilePage: React.FC = () => {
  const { profile, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-serif font-bold text-slate-800 mb-8">My Profile</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <p className="text-slate-800">{profile?.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-800">{profile?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone</label>
                  <p className="text-slate-800">{profile?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Address</label>
                  <p className="text-slate-800">{profile?.address || 'Not provided'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Account Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Account Type</label>
                  <p className="text-slate-800 capitalize">{profile?.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Member Since</label>
                  <p className="text-slate-800">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/measurements"
                className="bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors text-center"
              >
                Manage Measurements
              </Link>
              <Link
                to="/orders"
                className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors text-center"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 404 Not Found Page Component
const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            to="/shop"
            className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default App;