import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, MapPin, CheckCircle2, ArrowRight, Package, QrCode, Smartphone } from 'lucide-react';
import { placeOrder, addDemoOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';
import { State, City } from 'country-state-city';
import { INDIAN_DISTRICTS } from '../data/indianDistricts';

const Checkout = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const shipping = totalAmount > 500 ? 0 : 50;
  const tax = totalAmount * 0.1;
  const finalTotal = totalAmount + shipping + tax;

  const [step, setStep] = useState(() => {
    const savedStep = sessionStorage.getItem('checkoutStep');
    return savedStep ? parseInt(savedStep) : 1;
  });

  const [formData, setFormData] = useState(() => {
    const savedData = sessionStorage.getItem('checkoutFormData');
    return savedData ? JSON.parse(savedData) : {
      firstName: '', lastName: '', email: user?.email || '', phone: '',
      address: '', state: '', stateName: '', city: '', country: 'IN',
      paymentMethod: 'Cash on Delivery'
    };
  });

  useEffect(() => {
    sessionStorage.setItem('checkoutStep', step.toString());
    sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
  }, [step, formData]);

  const [upiPaymentStatus, setUpiPaymentStatus] = useState('idle'); // 'idle', 'scanning', 'success'

  useEffect(() => {
    let timer;
    if (formData.paymentMethod === 'UPI' && upiPaymentStatus === 'scanning') {
      timer = setTimeout(() => {
        setUpiPaymentStatus('success');
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [formData.paymentMethod, upiPaymentStatus]);

  const states = State.getStatesOfCountry('IN');

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'state') {
      const selectedState = states.find(s => s.name === value);
      setFormData(prev => ({
        ...prev,
        state: selectedState ? selectedState.isoCode : '',
        stateName: value,
        city: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const displayedCities = formData.state 
    ? (INDIAN_DISTRICTS[formData.state] || [])
    : [];

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderData = {
      items: items.map(item => ({
        product: item._id || item.id,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: State.getStateByCodeAndCountry(formData.state, 'IN')?.name || formData.state,
        country: 'India'
      },
      totalAmount: finalTotal,
      paymentMethod: formData.paymentMethod,
      user: user?._id || user?.id
    };

    const result = await dispatch(placeOrder(orderData));
    
    // For demo purposes, we navigate even if the API fails (mock success)
    const isSuccess = placeOrder.fulfilled.match(result);
    
    sessionStorage.removeItem('checkoutStep');
    sessionStorage.removeItem('checkoutFormData');
    
    const navigationState = {
      orderItems: items,
      totalAmount: finalTotal,
      subtotal: totalAmount,
      shipping: shipping,
      tax: tax,
      paymentMethod: formData.paymentMethod
    };

    if (isSuccess) {
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${result.payload.id || 'ORDER123'}`, { state: navigationState });
    } else {
      const demoId = `VOGUE-${Math.floor(Math.random() * 1000000)}`;
      dispatch(addDemoOrder({
        id: demoId,
        items: items,
        totalAmount: finalTotal,
        status: 'Processing',
        createdAt: new Date().toISOString()
      }));
      toast.success('Order placed successfully (Demo Mode)');
      navigate(`/order-confirmation/${demoId}`, { state: navigationState });
    }
  };

  useEffect(() => {
    // Only redirect to cart if items are empty AND we are not on the confirmation flow
    if (items.length === 0 && step === 1) {
      navigate('/cart');
    }
  }, [items, step, navigate]);

  if (items.length === 0 && step === 1) {
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
                  <div className="space-y-2 w-full">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">State</label>
                    <div className="relative">
                      <input
                        list="states-list"
                        name="state"
                        required
                        value={formData.stateName}
                        onChange={handleChange}
                        placeholder="Select or Type State"
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 shadow-xl shadow-gray-100/50"
                      />
                      <datalist id="states-list">
                        {states.map(s => (
                          <option key={s.isoCode} value={s.name} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div className="space-y-2 w-full">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">City</label>
                    <div className="relative">
                      <input
                        list="cities-list"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!formData.state}
                        placeholder={formData.state ? "Select or Type City" : "Select State first"}
                        className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 shadow-xl shadow-gray-100/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <datalist id="cities-list">
                        {displayedCities.map((cityName, i) => (
                          <option key={`${cityName}-${i}`} value={cityName} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div className="space-y-2 w-full sm:col-span-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Country</label>
                    <select
                      name="country"
                      disabled
                      value="IN"
                      className="w-full px-5 py-3 bg-white border border-gray-100 rounded-2xl text-gray-900 font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300 shadow-xl shadow-gray-100/50 appearance-none cursor-not-allowed opacity-70"
                    >
                      <option value="IN">India</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-8 animate-fade-in">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <CreditCard className="text-primary-600" /> Choose Payment Method
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cash on Delivery Card */}
                  <div 
                    onClick={() => {
                      setFormData({...formData, paymentMethod: 'Cash on Delivery'});
                      setUpiPaymentStatus('idle');
                    }}
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'Cash on Delivery' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-xl shadow-primary-500/10' : 'border-gray-100 dark:border-gray-800 hover:border-primary-200'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-4 rounded-2xl ${formData.paymentMethod === 'Cash on Delivery' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <Truck className="w-6 h-6" />
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'Cash on Delivery' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                        {formData.paymentMethod === 'Cash on Delivery' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Pay when order arrives</p>
                  </div>

                  {/* UPI Payment Card */}
                  <div 
                    onClick={() => {
                      setFormData({...formData, paymentMethod: 'UPI'});
                      if (upiPaymentStatus === 'idle') setUpiPaymentStatus('scanning');
                    }}
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'UPI' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-xl shadow-primary-500/10' : 'border-gray-100 dark:border-gray-800 hover:border-primary-200'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-4 rounded-2xl ${formData.paymentMethod === 'UPI' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'UPI' ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                        {formData.paymentMethod === 'UPI' && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <p className="text-lg font-black text-gray-900 dark:text-white">UPI Payment</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">Instant digital payment</p>
                  </div>
                </div>

                {/* Dynamic Content based on selection */}
                {formData.paymentMethod === 'Cash on Delivery' && (
                  <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 animate-slide-up">
                    <p className="text-sm text-gray-500 leading-relaxed italic">
                      "Pay with cash at the time of delivery. Please ensure someone is available at the address."
                    </p>
                  </div>
                )}

                {formData.paymentMethod === 'UPI' && (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 animate-slide-up space-y-6">
                    {upiPaymentStatus === 'scanning' ? (
                      <>
                        <div className="relative group">
                          <div className="absolute -inset-4 bg-gradient-to-r from-primary-600 to-accent-500 rounded-[2rem] opacity-20 blur-xl group-hover:opacity-40 transition duration-1000"></div>
                          <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-gray-100">
                            <img 
                              src="/upi-qr.png" 
                              alt="UPI QR Code" 
                              className="w-48 h-48 object-contain"
                            />
                            <div className="absolute inset-0 border-2 border-primary-600 rounded-3xl animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-center space-y-2">
                          <p className="font-black text-gray-900 dark:text-white flex items-center gap-2 justify-center">
                            <QrCode className="w-5 h-5 text-primary-600" /> Scan to Pay
                          </p>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest animate-pulse">Waiting for payment confirmation...</p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-4 animate-scale-in">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                          <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xl font-black text-gray-900 dark:text-white">Payment Successful!</h4>
                          <p className="text-sm text-gray-500 font-medium">Transaction ID: #UPI_82910482</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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
                    <p className="text-gray-600 dark:text-gray-400">{formData.address}, {formData.city}, {State.getStateByCodeAndCountry(formData.state, 'IN')?.name || formData.state}, India</p>
                    <p className="text-gray-600 dark:text-gray-400">{formData.phone}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm uppercase text-gray-400">Payment Method</h4>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.paymentMethod}</p>
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
                      <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
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
              <Button 
                type="submit" 
                loading={loading} 
                disabled={step === 2 && formData.paymentMethod === 'UPI' && upiPaymentStatus !== 'success'}
                className={`h-14 px-12 rounded-xl text-lg ${step < 3 ? 'w-full' : 'flex-1'}`}
              >
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
                  <p className="font-bold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="font-bold text-green-600">{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Estimated Tax</span>
                <span className="font-bold text-gray-900 dark:text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black pt-2 border-t border-gray-50 dark:border-gray-700 mt-2">
                <span>Total</span>
                <span className="text-primary-600">₹{finalTotal.toFixed(2)}</span>
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
