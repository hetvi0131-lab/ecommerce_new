import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, Wallet, CheckCircle } from 'lucide-react';
import api from '../../services/api/axiosConfig';
import Skeleton from '../common/Skeleton';
import { 
  PieChart,
  Pie,
  Cell,
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const AdminPayments = () => {
  const [stats, setStats] = useState({
    totalPayments: 0,
    codCount: 0,
    upiCount: 0,
    codAmount: 0,
    upiAmount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentStats = async () => {
      try {
        const { data: orders } = await api.get('/orders');
        
        const summary = orders.reduce((acc, order) => {
          const method = order.paymentMethod?.toUpperCase();
          if (method === 'COD') {
            acc.codCount += 1;
            acc.codAmount += order.totalAmount || 0;
          } else if (method === 'UPI' || method === 'ONLINE') {
            acc.upiCount += 1;
            acc.upiAmount += order.totalAmount || 0;
          }
          acc.totalPayments += order.totalAmount || 0;
          return acc;
        }, { codCount: 0, upiCount: 0, codAmount: 0, upiAmount: 0, totalPayments: 0 });

        setStats(summary);
      } catch (error) {
        console.error('Failed to fetch payment stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentStats();
  }, []);

  const paymentData = [
    { name: 'COD', value: stats.codCount, amount: stats.codAmount },
    { name: 'UPI/Online', value: stats.upiCount, amount: stats.upiAmount }
  ];

  const COLORS = ['#f97316', '#7c3aed'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-100 shadow-2xl rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{payload[0].name}</p>
          <p className="text-lg font-black text-primary-600">
            {payload[0].value} Orders
          </p>
          <p className="text-xs font-bold text-gray-400 mt-1">₹{payload[0].payload.amount.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const paymentMethods = [
    { 
      name: 'Cash on Delivery (COD)', 
      count: stats.codCount, 
      amount: stats.codAmount, 
      icon: DollarSign, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50',
      percentage: stats.totalPayments > 0 ? ((stats.codAmount / stats.totalPayments) * 100).toFixed(1) : 0
    },
    { 
      name: 'UPI / Online Payment', 
      count: stats.upiCount, 
      amount: stats.upiAmount, 
      icon: Wallet, 
      color: 'text-primary-600', 
      bg: 'bg-primary-50',
      percentage: stats.totalPayments > 0 ? ((stats.upiAmount / stats.totalPayments) * 100).toFixed(1) : 0
    }
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment Analytics</h1>
          <p className="text-gray-500 mt-1 font-medium">Overview of transaction methods and revenue distribution</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
          <h2 className="text-4xl font-black text-gray-900 mt-2">₹{stats.totalPayments.toLocaleString()}</h2>
        </div>

        {paymentMethods.map((method) => (
          <div key={method.name} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className={`w-14 h-14 rounded-2xl ${method.bg} ${method.color} flex items-center justify-center mb-6`}>
              <method.icon className="w-8 h-8" />
            </div>
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{method.name}</p>
            <div className="flex items-end gap-3 mt-2">
              <h2 className="text-4xl font-black text-gray-900">₹{method.amount.toLocaleString()}</h2>
              <span className={`text-sm font-black mb-1.5 ${method.color}`}>{method.percentage}%</span>
            </div>
            <p className="text-xs font-bold text-gray-400 mt-4 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {method.count} Successful transactions
            </p>
          </div>
        ))}
      </div>

      {/* Donut Chart Section */}
      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">Payment Method Distribution</h3>
            <p className="text-xs font-bold text-gray-400">Order split between COD and Online</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-10">
          <div className="h-[350px] w-full max-w-[400px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  formatter={(value) => <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</p>
              <p className="text-2xl font-black text-gray-900">{stats.codCount + stats.upiCount}</p>
              <p className="text-[10px] font-bold text-gray-400">Orders</p>
            </div>
          </div>

          <div className="flex-1 w-full space-y-6">
            {paymentMethods.map((method, index) => (
              <div key={method.name + '_bar'} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span className="text-gray-900">{method.name}</span>
                  <span className={method.color}>{method.percentage}%</span>
                </div>
                <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${method.name.includes('COD') ? 'bg-orange-500' : 'bg-primary-600'}`}
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
