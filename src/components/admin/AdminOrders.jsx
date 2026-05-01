import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Trash2, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import api from '../../services/api/axiosConfig';
import Skeleton from '../common/Skeleton';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-50 text-green-600';
      case 'shipped': return 'bg-blue-50 text-blue-600';
      case 'processing': return 'bg-orange-50 text-orange-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update status');
    }
  };

  const statusOptions = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Track and manage customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : orders.map((order) => {
                const Icon = getStatusIcon(order.status);
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-black text-gray-400 text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{order.user?.name || 'Guest User'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-black text-primary-600">₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status || 'Processing'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none ${getStatusColor(order.status)}`}
                        style={{ backgroundImage: 'none' }}
                      >
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {!loading && orders.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No orders found yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
