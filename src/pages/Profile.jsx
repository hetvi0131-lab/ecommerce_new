import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, MapPin, Package, Heart, LogOut, Settings, Bell, Shield, Smartphone } from 'lucide-react';
import { logout, updateProfile } from '../redux/slices/authSlice';
import { fetchOrders } from '../redux/slices/orderSlice';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  useEffect(() => {
    dispatch(fetchOrders());
    if (user) {
      setFormData({ 
        name: user.name, 
        email: user.email,
        phone: user.phone || '',
        location: user.location || ''
      });
    }
  }, [dispatch, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } else {
      toast.error(result.payload?.message || 'Update failed. Please try logging out and back in.');
    }
  };

  const stats = [
    { label: 'Orders', value: orders.length, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Wishlist', value: wishlistItems.length, icon: Heart, color: 'bg-red-50 text-red-600' },
    { label: 'Points', value: '450', icon: Bell, color: 'bg-yellow-50 text-yellow-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm text-center">
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-inner">
               <User className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'User Name'}</h2>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700">
               <Button onClick={() => dispatch(logout())} variant="outline" className="w-full text-red-600 border-red-100 hover:bg-red-50 gap-2 rounded-xl">
                 <LogOut className="w-4 h-4" /> Logout
               </Button>
            </div>
          </div>

          <nav className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            {[
              { label: 'My Orders', icon: Package, path: '/orders' },
              { label: 'Wishlist', icon: Heart, path: '/wishlist' },
              { label: 'Account Settings', icon: Settings, path: '/profile' },
              { label: 'Security', icon: Shield, path: '/profile' },
              { label: 'Notifications', icon: Bell, path: '/profile' },
            ].map((item) => (
              <Link 
                key={item.label} 
                to={item.path}
                className="w-full flex items-center gap-4 px-6 py-4 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 transition-all border-b border-gray-50 dark:border-gray-700 last:border-0 font-medium"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8">
            <h3 className="text-2xl font-bold">Personal Information</h3>
            <form onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase">Full Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium">
                       <User className="w-4 h-4 text-primary-600" /> {user?.name}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase">Email Address</p>
                  {isEditing ? (
                    <input
                      type="email"
                      className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium">
                       <Mail className="w-4 h-4 text-primary-600" /> {user?.email}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                      value={formData.phone}
                      placeholder="e.g. +91 9876543210"
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium text-gray-700">
                       <Smartphone className="w-4 h-4 text-primary-600" /> {user?.phone || 'Not set'}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase">Location</p>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                      value={formData.location}
                      placeholder="e.g. Mumbai, India"
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 font-medium">
                       <MapPin className="w-4 h-4 text-primary-600" /> {user?.location || 'Not set'}
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-4">
                {isEditing ? (
                  <>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="px-8 rounded-xl">Cancel</Button>
                    <Button type="submit" className="px-10 rounded-xl">Save Changes</Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)} className="px-10 rounded-xl">Edit Profile</Button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-blue-500 p-8 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="space-y-2">
                <h4 className="text-2xl font-bold">Vogue Premium</h4>
                <p className="text-white/80">You have active subscription until Jan 2027. Enjoy free shipping and early access!</p>
             </div>
             <Button className="bg-white text-primary-600 hover:bg-gray-100 border-none px-8 rounded-xl font-bold">Manage Plan</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
