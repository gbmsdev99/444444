import React from 'react';
import { Ruler, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-slate-700 to-slate-500 p-2 rounded-lg">
                <Ruler className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold">E-Tailor</h3>
                <p className="text-xs text-slate-400">Custom Clothing</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm">
              Crafting premium custom clothing with precision and style. 
              Your perfect fit, tailored to perfection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/shop" className="hover:text-white transition-colors">Shop</a></li>
              <li><a href="/measurements" className="hover:text-white transition-colors">Size Guide</a></li>
              <li><a href="/orders" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Custom Shirts</li>
              <li>Tailored Suits</li>
              <li>Formal Wear</li>
              <li>Alteration Services</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@etailor.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8 text-center text-sm text-slate-400">
          <p>Crafted by <span className="text-white font-medium">Aftab Alam</span> | Powered by <span className="text-white font-medium">Aftabstack</span> | © 2025 E-Tailor</p>
        </div>
      </div>
    </footer>
  );
};