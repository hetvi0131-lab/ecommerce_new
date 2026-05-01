import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';
import { login } from '../redux/slices/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      toast.success('Login successful!');
      const user = result.payload;
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2000" 
          alt="Login Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-10 animate-fade-in">
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Welcome Back</h2>
          <p className="text-gray-600 font-bold">Continue your premium shopping journey</p>
        </div>

        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(124,58,237,0.15)] border border-white/50 ring-1 ring-primary-500/10 transition-all hover:shadow-[0_20px_50px_rgba(124,58,237,0.25)]">
          <form onSubmit={handleSubmit} className="space-y-8">
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[46px] text-gray-400 hover:text-gray-900 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs uppercase tracking-widest font-black">
              <label className="flex items-center gap-3 text-gray-500 cursor-pointer hover:text-gray-900 transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 transition-all" />
                Remember me
              </label>
              <a href="#" className="text-primary-600 hover:underline">Forgot?</a>
            </div>

            {error && <p className="text-sm text-red-500 text-center font-bold">{error}</p>}

            <Button type="submit" loading={loading} className="w-full h-14 text-lg rounded-2xl shadow-2xl shadow-primary-500/40">
              Sign In <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center space-y-6">
            <p className="text-gray-500 font-medium">
              New here?{' '}
              <Link to="/register" className="font-black text-primary-600 hover:underline decoration-4 underline-offset-8">
                Create Account
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

export default Login;
