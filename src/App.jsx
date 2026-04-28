import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Loader from './components/common/Loader'; // I'll create this or use a simple div
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy loading pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const Profile = lazy(() => import('./pages/Profile'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

const App = () => {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    }>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products" element={<ProductListing />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          
          {/* Protected Routes */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="order-confirmation/:orderId" element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                 <h2 className="text-3xl font-bold">My Orders</h2>
                 <p className="text-gray-500 mt-4">Order history feature coming soon...</p>
              </div>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
