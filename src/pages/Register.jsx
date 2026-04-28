import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';
import { register } from '../redux/slices/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const result = await dispatch(register(formData));
    if (register.fulfilled.match(result)) {
      toast.success('Account created successfully!');
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000" 
          alt="Register Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-10 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Create Account</h2>
          <p className="text-gray-600 font-bold">Join our world of premium collections</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(124,58,237,0.15)] border border-white/50 ring-1 ring-primary-500/10 transition-all hover:shadow-[0_20px_50px_rgba(124,58,237,0.25)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Full Name"
                type="text"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                className="pl-12 h-14 rounded-2xl border-gray-200 bg-white/50 focus:ring-primary-500"
              />
              <User className="absolute left-4 top-[46px] w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-12 h-14 rounded-2xl border-gray-200 bg-white/50 focus:ring-primary-500"
              />
              <Mail className="absolute left-4 top-[46px] w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 bg-white/50 focus:ring-primary-500"
              />
              <Lock className="absolute left-4 top-[46px] w-5 h-5 text-gray-400" />
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 bg-white/50 focus:ring-primary-500"
              />
              <Lock className="absolute left-4 top-[46px] w-5 h-5 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[46px] text-gray-400 hover:text-gray-900 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-500">
              <input type="checkbox" required className="w-5 h-5 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 transition-all" />
              <span>I agree to the <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a></span>
            </div>

            {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}

            <Button type="submit" loading={loading} className="w-full h-14 text-lg rounded-2xl shadow-2xl shadow-primary-500/40">
              Create Account <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center space-y-6">
            <p className="text-gray-500 font-medium">
              Already a member?{' '}
              <Link to="/login" className="font-black text-primary-600 hover:underline decoration-4 underline-offset-8">
                Login Here
              </Link>
            </p>

            <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary-600 transition-all hover:gap-3">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
