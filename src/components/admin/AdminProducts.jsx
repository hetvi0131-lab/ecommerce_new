import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Edit2, Trash2, Package, Eye } from 'lucide-react';
import { fetchProducts, deleteProduct } from '../../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import Skeleton from '../common/Skeleton';
import AddProductModal from './AddProductModal';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Product Inventory</h1>
          <p className="text-gray-500 mt-1 font-medium">Add, update, and manage your store's product catalog</p>
        </div>
        <Button className="h-12 rounded-2xl gap-2 shadow-xl shadow-primary-500/20 px-8" onClick={handleAddClick}>
           <Plus className="w-5 h-5" /> Add New Product
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Total Products ({products.length})</h3>
          </div>
          <div className="relative w-full sm:w-80">
             <Input 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 rounded-xl"
             />
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5">Stock</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-6"><Skeleton className="h-12 w-48 rounded-xl" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-4 w-12" /></td>
                    <td className="px-8 py-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-8 py-6 text-right"><Skeleton className="h-10 w-32 rounded-xl ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.map((product) => (
                <tr key={product._id || product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                        <img 
                          src={product.image || 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=500'} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <span className="font-black text-gray-900 truncate max-w-[250px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-primary-600 text-lg">₹{product.price.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className={`text-sm font-black ${product.stock < 10 ? 'text-red-500' : 'text-gray-900'}`}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {product.stock === 0 ? 'Out of Stock' : 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-3 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all active:scale-90"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id || product.id)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => navigate(`/product/${product._id || product.id}`)}
                      className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredProducts.length === 0 && (
          <div className="p-32 text-center text-gray-400 font-bold">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-10" />
            <p>No products found matching your search.</p>
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

export default AdminProducts;
