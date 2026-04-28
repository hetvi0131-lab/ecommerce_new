import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, ShieldCheck, Clock } from 'lucide-react';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';

const Home = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);

  const categories = [
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=500', color: 'bg-blue-50' },
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=500', color: 'bg-purple-50' },
    { name: 'Home & Decor', image: 'https://images.unsplash.com/photo-1513519247388-19345ed5d467?auto=format&fit=crop&q=80&w=500', color: 'bg-orange-50' },
    { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=500', color: 'bg-pink-50' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background with subtle parallax-ready image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481658327-477b93821a21?auto=format&fit=crop&q=80&w=2000"
            alt="Hero Luxury"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white" />
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 animate-float">
            <div className="flex justify-center">
              <span className="inline-flex items-center px-5 py-2 bg-white/80 backdrop-blur-md border border-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl shadow-gray-200/50">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 animate-pulse" />
                Exclusive Edition 2026
              </span>
            </div>
            
            <h1 className="text-6xl md:text-[100px] font-black leading-[0.85] tracking-[-0.05em] text-gray-900 uppercase">
              Style <span className="text-primary-600">Re</span>Defined <br />
              <span className="text-[0.4em] block font-black tracking-[0.2em] mt-4 bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                Experience the Future
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Curating the world's most exquisite fashion and technology. <br className="hidden md:block" /> 
              The pinnacle of digital luxury, designed for you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Link to="/products">
                <Button className="h-16 px-12 text-lg rounded-full shadow-[0_20px_50px_rgba(124,58,237,0.3)] hover:scale-105 transition-transform duration-300">
                  Shop Collection <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <button 
                onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] text-gray-900 hover:text-primary-600 transition-colors"
              >
                Explore Categories <div className="w-12 h-[2px] bg-gray-200 group-hover:w-16 group-hover:bg-primary-600 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 px-8 bg-white rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary-50 rounded-2xl text-primary-600">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-sm text-gray-900">Free Shipping</h4>
              <p className="text-xs text-gray-500 font-medium">Orders over $100</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="p-4 bg-green-50 rounded-2xl text-green-600">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-sm text-gray-900">Secure Payment</h4>
              <p className="text-xs text-gray-500 font-medium">100% Protected</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-sm text-gray-900">24/7 Support</h4>
              <p className="text-xs text-gray-500 font-medium">Dedicated help</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="p-4 bg-purple-50 rounded-2xl text-purple-600">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-black text-sm text-gray-900">Easy Returns</h4>
              <p className="text-xs text-gray-500 font-medium">30 days policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-4">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter">Shop by Category</h2>
            <p className="text-gray-500 font-medium text-lg">Explore our wide range of curated collections</p>
          </div>
          <Link to="/products" className="group flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest text-sm hover:gap-4 transition-all duration-300">
            View All <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=600', color: 'from-orange-500/20' },
            { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600', color: 'from-blue-500/20' },
            { name: 'Home & Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600', color: 'from-green-500/20' },
            { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600', color: 'from-pink-500/20' }
          ].map((cat, i) => (
            <Link 
              key={i}
              to={`/products?category=${cat.name.toLowerCase()}`}
              className="group relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/50 hover:-translate-y-2 transition-all duration-500"
            >
              <img 
                src={cat.image} 
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Explore Items</p>
                <h3 className="text-3xl font-black tracking-tighter">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <p className="text-gray-500 mt-2">Handpicked items for your style</p>
          </div>
          <Link to="/products" className="text-primary-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            Explore All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {/* Fallback products if API returns empty for now */}
            {!products.length && [...Array(4)].map((_, i) => (
               <ProductCard key={i} product={{
                 id: i,
                 name: `Sample Product ${i+1}`,
                 price: 199.99,
                 category: 'Fashion',
                 image: `https://images.unsplash.com/photo-${1523275335684 + i}?auto=format&fit=crop&q=80&w=500`,
                 rating: 4.8,
                 reviews: 124
               }} />
            ))}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[3rem] overflow-hidden h-[450px] flex items-center shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1555529669-e69e730f162b?auto=format&fit=crop&q=80&w=1500"
            alt="Promo"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-600/20" />
          <div className="relative z-10 px-16 space-y-6">
            <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              Limited Time Offer
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Season End <br /> <span className="text-accent-400">Grand Sale</span>
            </h2>
            <p className="text-xl text-white/80 max-w-md font-medium">
              Experience the pinnacle of luxury with up to 70% off on all premium collections.
            </p>
            <Button className="bg-accent-500 text-gray-900 hover:bg-accent-400 border-none px-10 h-14 rounded-full font-black text-lg shadow-xl shadow-accent-500/30">
              Claim Your Offer
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
