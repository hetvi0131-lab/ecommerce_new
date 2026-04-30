import { useParams, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice';
import { CheckCircle2, Package, ArrowRight, Download, XCircle, FileText, Printer } from 'lucide-react';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import React, { useEffect } from 'react';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const orderData = location.state || {
    orderItems: [],
    totalAmount: 0,
    subtotal: 0,
    shipping: 0,
    tax: 0,
    paymentMethod: 'Cash on Delivery'
  };

  const handleCancelOrder = () => {
    toast.error('Order cancellation request submitted.');
  };

  const handleDownloadInvoice = () => {
    toast.info('Downloading your invoice...');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-6 mb-12 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Order Confirmed!</h1>
          <p className="text-gray-500 font-medium">Thank you for shopping with VOGUE. Your style journey begins now.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Invoice Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-slide-up">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-3">
              <FileText className="text-primary-600 w-6 h-6" />
              <h2 className="text-xl font-black uppercase tracking-tight">Invoice Details</h2>
            </div>
            <p className="text-sm font-black text-primary-600">#{orderId || 'VOGUE-72819'}</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-1">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Order Date</p>
                <p className="font-bold text-gray-900 dark:text-white">April 30, 2026</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Payment Method</p>
                <p className="font-bold text-gray-900 dark:text-white">{orderData.paymentMethod}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-4">
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Items Purchased</p>
              <div className="space-y-4">
                {orderData.orderItems.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-gray-800">
                    <div className="flex gap-4">
                      <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-black text-primary-600">{item.quantity}x</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-black text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold">₹{orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-green-600">{orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (10%)</span>
                <span className="font-bold">₹{orderData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-4 border-t border-gray-100 dark:border-gray-800">
                <span className="tracking-tighter">Grand Total</span>
                <span className="text-primary-600">₹{orderData.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-6">
            <h3 className="font-black uppercase tracking-widest text-xs text-gray-400">Order Actions</h3>
            
            <div className="space-y-4">
              <Button 
                onClick={handleDownloadInvoice}
                className="w-full h-14 rounded-2xl gap-3 bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30"
              >
                <Download className="w-5 h-5" /> Download Bill
              </Button>
              
              <Button 
                onClick={handleCancelOrder}
                variant="outline" 
                className="w-full h-14 rounded-2xl gap-3 text-red-500 border-red-100 hover:bg-red-50"
              >
                <XCircle className="w-5 h-5" /> Cancel Order
              </Button>

              <Button 
                onClick={() => window.print()}
                variant="ghost" 
                className="w-full h-14 rounded-2xl gap-3"
              >
                <Printer className="w-5 h-5" /> Print Receipt
              </Button>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-[2rem] border border-primary-100 dark:border-primary-800">
            <p className="text-xs text-primary-700 dark:text-primary-400 font-medium leading-relaxed">
              We've sent a detailed confirmation to your email. You can track your order status in your profile dashboard.
            </p>
          </div>

          <Link to="/" className="block">
            <Button variant="outline" className="w-full h-14 rounded-2xl gap-2 border-gray-200">
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
