import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../redux/slices/orderSlice';
import { Package, Truck, CheckCircle2, ChevronRight, Clock } from 'lucide-react';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const displayOrders = orders;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">My Orders</h1>
          <p className="text-gray-500 font-medium">Track your style shipments and order history.</p>
        </div>
        <Link to="/products">
          <Button variant="outline" className="rounded-2xl">Continue Shopping</Button>
        </Link>
      </div>

      <div className="space-y-8">
        {displayOrders.length > 0 ? (
          displayOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-slide-up">
              <div className="p-6 md:p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm">
                    <Package className="text-primary-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order ID</p>
                    <p className="font-black text-gray-900 dark:text-white">#{order.id}</p>
                  </div>
                </div>
                
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Date</p>
                    <p className="font-bold">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total</p>
                    <p className="font-black text-primary-600">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 rounded-full text-xs font-bold uppercase tracking-widest border border-yellow-100 dark:border-yellow-800">
                  <Clock className="w-3 h-3" /> {order.status || 'Processing'}
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="space-y-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-800">
                          {item.image ? (
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-black">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 flex justify-end">
                  <Link to={`/order-confirmation/${order.id}`}>
                    <Button variant="ghost" className="gap-2 group">
                      View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-200/50 dark:shadow-none">
              <Package className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">No Orders Yet</h3>
            <p className="text-gray-500 font-medium mt-2 max-w-xs mx-auto">Looks like you haven't placed any orders yet. Start shopping to fill this space!</p>
            <Link to="/products" className="inline-block mt-8">
              <Button className="h-14 px-10 rounded-2xl shadow-xl shadow-primary-500/20">Explore Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
