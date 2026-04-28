import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';

const Cart = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shipping = totalAmount > 500 ? 0 : 50;
  const tax = totalAmount * 0.1;
  const finalTotal = totalAmount + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6 animate-fade-in">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Your cart is empty</h2>
          <p className="text-gray-500">Looks like you haven't added anything to your cart yet. Explore our latest collections to find something you love!</p>
          <Link to="/products">
            <Button className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary-500/30 mt-4">
              <ArrowLeft className="w-5 h-5" /> Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-10">Shopping Cart ({items.length})</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="group flex flex-col sm:flex-row gap-6 p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 transition-colors">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                      className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400 line-through">${(item.price * 1.2).toFixed(2)}</p>
                    <p className="text-2xl font-black text-primary-600">${item.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4">
            <Link to="/products" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:gap-4 transition-all">
              <ArrowLeft className="w-5 h-5" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-24 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Shipping</span>
                <span className="font-bold text-green-600">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Estimated Tax</span>
                <span className="font-bold text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
                  <span className="text-3xl font-black text-primary-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  className="w-full pl-4 pr-24 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <button className="absolute right-2 top-2 px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-lg">APPLY</button>
              </div>
              
              <Button onClick={() => navigate('/checkout')} className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary-500/30">
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="pt-6 text-center space-y-4">
              <p className="text-xs text-gray-400">We accept</p>
              <div className="flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
