import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Download, Share2 } from 'lucide-react';
import Button from '../components/common/Button';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="space-y-8 animate-slide-up">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-10">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Thank you for your purchase. We're getting your order ready.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-4 border-b border-gray-50 dark:border-gray-700">
            <div className="text-left">
              <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Order Number</p>
              <p className="text-xl font-black text-primary-600">#{orderId || 'VOGUE-72819'}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-400 uppercase font-bold tracking-widest">Estimated Delivery</p>
              <p className="text-lg font-bold">April 30, 2026</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" /> Download Invoice
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="w-4 h-4" /> Share Order
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-gray-500">We've sent a confirmation email to your registered address with all the details and tracking information.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/orders">
              <Button variant="secondary" className="h-14 px-8 rounded-xl w-full sm:w-auto">
                <Package className="w-5 h-5 mr-2" /> View My Orders
              </Button>
            </Link>
            <Link to="/">
              <Button className="h-14 px-8 rounded-xl w-full sm:w-auto">
                Continue Shopping <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
