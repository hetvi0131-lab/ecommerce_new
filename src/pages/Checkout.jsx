import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { placeOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: user?.email || '', phone: '',
    address: '', city: '', zipCode: '', country: '',
    cardNumber: '', expDate: '', cvc: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      items,
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country
      },
      totalAmount: totalAmount + 50, // Including shipping/tax
      paymentMethod: 'Credit Card'
    };

    const result = await dispatch(placeOrder(orderData));
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${result.payload.id || 'ORDER123'}`);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Forms */}
        <div className="lg:col-span-2 space-y-8 flex-1">
          {/* Progress Stepper */}
          <div className="flex items-center gap-4 mb-10">
            {[
              { id: 1, name: 'Shipping', icon: MapPin },
              { id: 2, name: 'Payment', icon: CreditCard },
              { id: 3, name: 'Review', icon: CheckCircle2 }
            ].map((s) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-3 ${step >= s.id ? 'text-primary-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= s.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm hidden sm:block">{s.name}</span>
                </div>
                {s.id < 3 && <div className={`flex-1 h-0.5 max-w-[50px] rounded-full transition-all ${step > s.id ? 'bg-primary-600' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={step === 3 ? handlePlaceOrder : (e) => { e.preventDefault(); setStep(step + 1); }} className="space-y-8">
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                   <MapPin className="text-primary-600" /> Shipping Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} />
                  <Input label="Last Name" name="lastName" required value={formData.lastName} onChange={handleChange} />
                  <Input label="Email Address" name="email" type="email" required value={formData.email} onChange={handleChange} />
                  <Input label="Phone Number" name="phone" required value={formData.phone} onChange={handleChange} />
                  <div className="sm:col-span-2">
                    <Input label="Shipping Address" name="address" required value={formData.address} onChange={handleChange} />
                  </div>
                  <Input label="City" name="city" required value={formData.city} onChange={handleChange} />
                  <Input label="ZIP Code" name="zipCode" required value={formData.zipCode} onChange={handleChange} />
                  <div className="sm:col-span-2">
                    <Input label="Country" name="country" required value={formData.country} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6 animate-fade-in">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                   <CreditCard className="text-primary-600" /> Payment Method
                </h3>
                <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border-2 border-primary-200 dark:border-primary-800 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                      <CreditCard className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-bold">Credit / Debit Card</p>
                      <p className="text-xs text-gray-500">Secure encrypted payment</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-primary-600 w-6 h-6" />
                </div>
                
                <div className="space-y-6">
                  <Input label="Card Number" name="cardNumber" placeholder="0000 0000 0000 0000" required value={formData.cardNumber} onChange={handleChange} />
                  <div className="grid grid-cols-2 gap-6">
                    <Input label="Expiry Date" name="expDate" placeholder="MM/YY" required value={formData.expDate} onChange={handleChange} />
                    <Input label="CVC" name="cvc" placeholder="123" required value={formData.cvc} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8 animate-fade-in">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                   <CheckCircle2 className="text-primary-600" /> Review Order
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase text-gray-400">Shipping To</h4>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.firstName} {formData.lastName}</p>
                    <p className="text-gray-600 dark:text-gray-400">{formData.address}, {formData.city}, {formData.zipCode}, {formData.country}</p>
                    <p className="text-gray-600 dark:text-gray-400">{formData.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase text-gray-400">Payment Method</h4>
                    <p className="font-medium text-gray-900 dark:text-white">Credit Card ending in {formData.cardNumber.slice(-4)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase text-gray-400">Items</h4>
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                      <div className="flex gap-4">
                        <span className="font-bold text-primary-600">{item.quantity}x</span>
                        <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                      </div>
                      <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="h-14 px-8 rounded-xl">
                  Back
                </Button>
              )}
              <Button type="submit" loading={loading} className={`h-14 px-12 rounded-xl text-lg ${step < 3 ? 'w-full' : 'flex-1'}`}>
                {step === 3 ? 'Place Order' : 'Next Step'} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-96">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-24 space-y-6">
            <h3 className="text-xl font-bold">Order Summary</h3>
            <div className="space-y-4">
               {items.map(item => (
                 <div key={item.id} className="flex gap-4">
                   <div className="w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-900 overflow-hidden flex-shrink-0">
                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-bold truncate">{item.name}</p>
                     <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                   </div>
                   <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                 </div>
               ))}
            </div>
            
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-2">
                <span>Total</span>
                <span className="text-primary-600">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl flex gap-3 items-start">
               <Truck className="w-5 h-5 text-yellow-600 flex-shrink-0" />
               <p className="text-xs text-yellow-700 dark:text-yellow-500">Your order is eligible for <b>Fast Free Delivery</b>. Expect it within 2-4 business days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
