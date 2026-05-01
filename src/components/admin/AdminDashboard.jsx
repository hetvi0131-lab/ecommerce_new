import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { fetchProducts } from '../../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api/axiosConfig';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    productsCount: 0,
    weeklyData: []
  });

  useEffect(() => {
    dispatch(fetchProducts());
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setDashboardStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, [dispatch]);

  const stats = [
    { label: 'Total Revenue', value: `₹${(dashboardStats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Orders', value: (dashboardStats?.totalOrders || 0).toLocaleString(), icon: ShoppingBag, color: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Active Users', value: (dashboardStats?.activeUsers || 0).toLocaleString(), icon: Users, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Products', value: (products?.length || dashboardStats?.productsCount || 0).toLocaleString(), icon: Package, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 shadow-2xl rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-lg font-black text-primary-600">
            ₹{payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Welcome back! Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-[10px] font-black bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full uppercase tracking-widest">
                <TrendingUp className="w-3 h-3" /> +12.5%
              </div>
            </div>
            <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">{stat.label}</p>
            <p className="text-4xl font-black mt-2 text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 gap-8">
        {/* Weekly Revenue Growth Chart (Area Chart) */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">Weekly Revenue Growth</h3>
              <p className="text-xs font-bold text-gray-400">Total revenue generated over the last 7 days</p>
            </div>
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboardStats.weeklyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis hide={true} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7c3aed', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#7c3aed" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
