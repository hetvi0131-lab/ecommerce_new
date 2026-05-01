import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Package,
  CreditCard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Store,
  Menu,
  X
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';

const AdminSidebar = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out
        bg-white border-r border-gray-100 shadow-2xl shadow-gray-200/50
        ${isCollapsed ? 'w-24' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Store className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <span className="text-2xl font-black bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent tracking-tighter">
                  VOGUE
                </span>
              )}
            </Link>
          </div>

          {/* User Info (Minimalist) */}
          {!isCollapsed && (
            <div className="mx-6 mb-6 p-4 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-black">
                  {user?.name?.[0] || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900 truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{user?.role || 'Administrator'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                    ${isActive 
                      ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-primary-600'}`} />
                  {!isCollapsed && (
                    <span className="font-bold flex-1">{item.name}</span>
                  )}
                  {isActive && !isCollapsed && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-50 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <Store className="w-5 h-5" />
              {!isCollapsed && <span className="font-bold text-sm">Back to Store</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="font-bold text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
