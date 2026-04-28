import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { removeFromWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleMoveToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
    toast.success('Moved to cart!');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-3xl font-extrabold">Your wishlist is empty</h2>
          <p className="text-gray-500">Save items you love to your wishlist and they will appear here.</p>
          <Link to="/products">
            <Button className="h-14 px-8 rounded-full">
               <ArrowLeft className="w-5 h-5 mr-2" /> Explore Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-10">My Wishlist ({items.length})</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={() => dispatch(removeFromWishlist(product.id))}
                className="p-2 bg-white/90 dark:bg-gray-800/90 text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
            <div className="mt-4">
               <Button onClick={() => handleMoveToCart(product)} variant="outline" className="w-full rounded-xl gap-2">
                 <ShoppingCart className="w-4 h-4" /> Move to Cart
               </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
