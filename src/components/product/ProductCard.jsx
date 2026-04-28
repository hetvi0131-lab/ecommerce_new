import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all ${
              isInWishlist ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">{product.category}</p>
          <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">{product.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent-500 text-accent-500" />
            <span className="text-sm font-bold text-gray-700">{product.rating || 4.5}</span>
            <span className="text-xs text-gray-400 font-medium">({product.reviews || 0} reviews)</span>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="text-2xl font-black text-gray-900">${product.price}</span>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
