import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Shield, User as UserIcon, Trash2 } from 'lucide-react';
import api from '../../services/api/axiosConfig';
import Skeleton from '../common/Skeleton';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/dashboard/users'); // I'll assume this endpoint exists or I'll add it
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Customer Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your registered customers and their roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-12 h-12 rounded-2xl" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))
        ) : users.map((user) => (
          <div key={user._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                  <UserIcon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900">{user.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <button className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-500" />
                <span>Verified</span>
              </div>
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {!loading && users.length === 0 && (
        <div className="p-20 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No customers found yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
