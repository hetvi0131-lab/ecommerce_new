import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingCart, Heart, User, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import Button from '../common/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  useEffect(() => {
    // Clear any stuck dark theme
    localStorage.removeItem('theme');
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent tracking-tighter">
              VOGUE
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-2.5 pl-12 bg-white border border-gray-100 rounded-2xl text-gray-900 focus:ring-2 focus:ring-primary-500 transition-all outline-none shadow-xl shadow-gray-100/50 font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </form>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setIsDark(!isDark)} className="p-3 hover:bg-gray-50 rounded-xl transition-colors">
              {isDark ? <Sun className="w-5 h-5 text-accent-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>
            
            <Link to="/wishlist" className="relative p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <Heart className="w-5 h-5 text-gray-500" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-2 right-2 bg-accent-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-3 hover:bg-gray-50 rounded-xl transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-500" />
              {cartItems.length > 0 && (
                <span className="absolute top-2 right-2 bg-primary-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-black text-gray-900">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-4 w-56 bg-white border border-gray-100 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-[100]">
                  <div className="px-4 py-3 mb-2 border-b border-gray-50">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Account</p>
                    <p className="text-sm font-black text-gray-900 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">Profile</Link>
                  <Link to="/orders" className="block px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors">Order History</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-5 py-2.5 text-sm font-black text-primary-600 hover:bg-primary-50 transition-colors border-l-4 border-primary-600">Admin Dashboard</Link>
                  )}
                  <div className="my-2 border-t border-gray-50" />
                  <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-sm font-black text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="text-sm px-6">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsDark(!isDark)} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              {isDark ? <Sun className="w-5 h-5 text-accent-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 border-none rounded-lg outline-none"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600">Home</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600">Products</Link>
            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600">Wishlist</Link>
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600">Profile</Link>
                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600">Orders</Link>
                <button onClick={handleLogout} className="block w-full text-left text-lg font-medium text-red-600">Logout</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
