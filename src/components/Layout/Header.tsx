import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Ruler, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../lib/supabase';
import toast from 'react-hot-toast';

export const Header: React.FC = () => {
  const location = useLocation();
  const { profile, isAuthenticated, isAdmin } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'My Orders', href: '/orders' },
    { name: 'Measurements', href: '/measurements' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-slate-800 to-slate-600 p-2 rounded-lg"
            >
              <Ruler className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-slate-800">E-Tailor</h1>
              <p className="text-xs text-slate-500">Custom Clothing</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-slate-800'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {item.name}
                {location.pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-800"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && profile ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{profile.full_name || profile.email}</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin-dashboard-secret" className="flex items-center space-x-1 text-slate-600 hover:text-slate-800">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Admin</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-slate-600 hover:text-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};