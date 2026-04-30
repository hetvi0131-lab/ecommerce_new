import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Edit2, Trash2, Package, Users, DollarSign, ShoppingBag, Eye, TrendingUp } from 'lucide-react';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import Skeleton from '../common/Skeleton';
import AddProductModal from './AddProductModal';
import api from '../../services/api/axiosConfig';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Product deleted successfully');
        }
      });
    }
  };
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    productsCount: 0
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your store products, orders and customers</p>
        </div>
        <Button className="h-12 rounded-xl gap-2 shadow-lg shadow-primary-500/30" onClick={handleAddClick}>
           <Plus className="w-5 h-5" /> Add New Product
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" /> +12%
              </div>
            </div>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black mt-1 text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Product List */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Inventory</h3>
          <div className="relative w-full sm:w-72">
             <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
             />
             <Search className="absolute left-3 top-[10px] w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.map((product) => (
                <tr key={product._id || product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
                        <img 
                          src={product.image || 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=500'} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 capitalize">{product.category}</td>
                  <td className="px-6 py-4 font-black text-primary-600">₹{product.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`font-bold ${product.stock < 10 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                      {product.stock || 24}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock === 0 ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'}`}>
                      {product.stock === 0 ? 'Out of Stock' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                      className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all active:scale-95 cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(product._id || product.id); }}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all active:scale-95 cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id || product.id}`); }}
                      className="p-2.5 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-xl transition-all active:scale-95 cursor-pointer"
                      title="View Product"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredProducts.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            No products found matching your search.
          </div>
        )}
      </div>

      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct}
      />
    </div>
  );
};

export default AdminDashboard;
