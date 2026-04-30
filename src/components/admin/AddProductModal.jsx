import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Upload, Plus, Edit2 } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { toast } from 'react-toastify';
import { createProduct, updateProduct } from '../../redux/slices/productSlice';
import { useEffect } from 'react';

const AddProductModal = ({ isOpen, onClose, product = null }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'fashion',
    description: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        category: product.category || 'fashion',
        description: product.description || '',
        stock: product.stock || '',
        image: product.image || ''
      });
    } else {
      setFormData({
        name: '',
        price: '',
        category: 'fashion',
        description: '',
        stock: '',
        image: ''
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    if (product) {
      dispatch(updateProduct({ id: product._id || product.id, productData })).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Product updated successfully!');
          onClose();
        }
      });
    } else {
      dispatch(createProduct(productData)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Product added to database successfully!');
          onClose();
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Product Name" 
              placeholder="e.g. Premium Silk Shirt"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label="Price (₹)" 
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Category</label>
              <select 
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="fashion">Fashion</option>
                <option value="electronics">Electronics</option>
                <option value="home & decor">Home & Decor</option>
                <option value="beauty">Beauty</option>
                <option value="jewellery">Jewellery</option>
              </select>
            </div>
            <Input 
              label="Stock Quantity" 
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Description</label>
            <textarea 
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="Tell us about this product..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Product Image URL</label>
            <div className="flex gap-4">
              <Input 
                placeholder="https://images.unsplash.com/..."
                className="flex-1"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
              />
              <button type="button" className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 transition-colors">
                <Upload className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 gap-2">
              {product ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {product ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
