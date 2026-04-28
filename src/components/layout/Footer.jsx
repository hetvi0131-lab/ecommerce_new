import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Send, Camera, Play, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent tracking-tighter">
              VogueStore
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Elevate your style with our curated collection of premium fashion and lifestyle products. We bring the best trends right to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-primary-50 transition-all shadow-sm">
                <Globe className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-primary-50 transition-all shadow-sm">
                <Camera className="w-5 h-5 text-gray-600" />
              </a>
              <a href="#" className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-primary-50 transition-all shadow-sm">
                <Send className="w-5 h-5 text-gray-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-8">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium">Categories</Link></li>
              <li><Link to="/wishlist" className="text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium">Wishlist</Link></li>
              <li><Link to="/cart" className="text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-8">Customer Service</h4>
            <ul className="space-y-4">
              <li><Link to="/profile" className="text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium">My Account</Link></li>
              <li><Link to="/orders" className="text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium">Order History</Link></li>
              <li><Link to="/shipping" className="text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium">Shipping Policy</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-primary-600 transition-colors text-sm font-medium">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-8">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-sm text-gray-500 font-medium">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <MapPin className="w-4 h-4 text-primary-600" />
                </div>
                <span>123 Fashion Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <Phone className="w-4 h-4 text-primary-600" />
                </div>
                <span>+1 (212) 555-0123</span>
              </li>
              <li className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                  <Mail className="w-4 h-4 text-primary-600" />
                </div>
                <span>support@voguestore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <p>© 2026 VogueStore. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
