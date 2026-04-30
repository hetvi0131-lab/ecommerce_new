import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, RotateCcw, ShieldCheck, Share2 } from 'lucide-react';
import { fetchProductById, clearSelectedProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading } = useSelector((state) => state.products);
  const wishlist = useSelector((state) => state.wishlist.items);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  const isInWishlist = wishlist.some((item) => (item._id || item.id) === (product?._id || product?.id));

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearSelectedProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images || [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm group">
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary-600 shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 text-xs font-bold uppercase tracking-widest rounded-full">
                {product.category}
              </span>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:text-primary-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => dispatch(toggleWishlist(product))}
                  className={`p-2 rounded-full transition-all ${isInWishlist ? 'bg-red-50 text-red-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500'}`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-yellow-700 dark:text-yellow-500">{product.rating || 4.5}</span>
              </div>
              <span className="text-gray-400 text-sm">({product.reviews || 0} customer reviews)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="text-green-600 text-sm font-semibold">In Stock</span>
            </div>
            
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-extrabold text-primary-600">₹{product.price}</span>
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through">₹{product.oldPrice}</span>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            {product.description || "Experience the perfect blend of style and functionality. This premium product is designed to meet your highest expectations, featuring top-quality materials and innovative design."}
          </p>

          <div className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1 h-14 text-lg rounded-xl shadow-lg shadow-primary-500/30">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Button>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <Truck className="w-6 h-6 text-primary-600" />
              <div>
                <h5 className="font-bold text-sm">Free Delivery</h5>
                <p className="text-xs text-gray-500">Enter your postal code for delivery availability</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
              <RotateCcw className="w-6 h-6 text-primary-600" />
              <div>
                <h5 className="font-bold text-sm">Return Delivery</h5>
                <p className="text-xs text-gray-500">Free 30 days delivery returns. Details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex gap-8">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-600 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[200px]">
        {activeTab === 'description' && (
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
            <p>Our {product.name} is meticulously crafted for excellence. Featuring a sleek aesthetic that complements any setting, it stands as a testament to quality craftsmanship and modern design. Whether for daily use or special occasions, this product delivers exceptional performance and reliability.</p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>Premium quality materials for long-lasting durability</li>
              <li>Ergonomic design for maximum comfort and ease of use</li>
              <li>Lightweight and portable, making it perfect for on-the-go lifestyles</li>
              <li>Advanced technology integrated for a seamless experience</li>
            </ul>
          </div>
        )}
        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ['Material', 'Premium Composite'],
              ['Dimensions', '15 x 10 x 5 inches'],
              ['Weight', '1.2 lbs'],
              ['Origin', 'United States'],
              ['Warranty', '2 Years Limited']
            ].map(([key, val]) => (
              <div key={key} className="flex justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-gray-500">{key}</span>
                <span className="font-bold">{val}</span>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="flex items-center gap-8 bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl">
              <div className="text-center">
                <h3 className="text-5xl font-extrabold text-gray-900 dark:text-white">{product.rating || 4.5}</h3>
                <div className="flex items-center gap-1 my-2">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-500 text-sm">Product Rating</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4">
                    <span className="text-sm w-4">{star}</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
