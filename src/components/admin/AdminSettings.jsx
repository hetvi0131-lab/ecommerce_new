import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserPlus, Shield, User, Mail, Lock, Save, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../../services/api/axiosConfig';
import Button from '../common/Button';
import Input from '../common/Input';
import { updateProfile } from '../../redux/slices/authSlice';

const AdminSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Current Admin Info Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  // Add New Admin Form
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [addingAdmin, setAddingAdmin] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleNewAdminChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  const updateCurrentProfile = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(result.payload?.message || 'Update failed');
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setAddingAdmin(true);
    try {
      await api.post('/auth/add-admin', newAdmin);
      toast.success('New admin added successfully!');
      setNewAdmin({ name: '', email: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add admin');
    } finally {
      setAddingAdmin(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Settings</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your personal profile and system administrators</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Profile Settings */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Your Profile</h3>
          </div>

          <form onSubmit={updateCurrentProfile} className="space-y-6">
            <Input 
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              placeholder="Your name"
            />
            <Input 
              label="Email Address"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              placeholder="Your email"
              disabled
            />
            <Input 
              label="Phone Number"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              placeholder="Your phone number"
            />
            <Input 
              label="Location"
              name="location"
              value={profileData.location}
              onChange={handleProfileChange}
              placeholder="Your location"
            />
            <Button type="submit" className="w-full h-14 rounded-2xl shadow-xl shadow-primary-500/20 gap-2">
              <Save className="w-5 h-5" /> Save Changes
            </Button>
          </form>
        </div>

        {/* Add New Admin */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Add New Admin</h3>
          </div>

          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Invite another user to manage the store. They will have full access to the admin dashboard, products, and orders.
          </p>

          <form onSubmit={handleAddAdmin} className="space-y-6 pt-4">
            <div className="relative">
              <Input 
                label="Full Name"
                name="name"
                value={newAdmin.name}
                onChange={handleNewAdminChange}
                placeholder="New admin's name"
                required
                className="pl-12"
              />
              <User className="absolute left-4 top-[46px] w-5 h-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input 
                label="Email Address"
                name="email"
                type="email"
                value={newAdmin.email}
                onChange={handleNewAdminChange}
                placeholder="New admin's email"
                required
                className="pl-12"
              />
              <Mail className="absolute left-4 top-[46px] w-5 h-5 text-gray-400" />
            </div>
            <div className="relative">
              <Input 
                label="Temporary Password"
                name="password"
                type="password"
                value={newAdmin.password}
                onChange={handleNewAdminChange}
                placeholder="••••••••"
                required
                className="pl-12"
              />
              <Lock className="absolute left-4 top-[46px] w-5 h-5 text-gray-400" />
            </div>
            <Button 
              type="submit" 
              loading={addingAdmin}
              className="w-full h-14 rounded-2xl bg-gray-900 hover:bg-black shadow-xl shadow-gray-900/20 gap-2"
            >
              Add Administrator <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 flex gap-4 mt-8">
            <Shield className="w-6 h-6 text-purple-600 shrink-0" />
            <p className="text-xs font-bold text-purple-700 leading-relaxed">
              Security Note: Only existing administrators can add new admins. Make sure you trust the person you are adding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
