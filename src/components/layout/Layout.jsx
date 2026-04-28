import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  const location = useLocation();
  const hideNavFooter = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
      {!hideNavFooter && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!hideNavFooter && <Footer />}
      <ToastContainer position="bottom-right" theme="colored" />
    </div>
  );
};

export default Layout;
