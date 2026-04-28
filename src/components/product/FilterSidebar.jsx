import React from 'react';
import { useSelector } from 'react-redux';
import { X, Star } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, onClose }) => {
  const { categories } = useSelector((state) => state.products);

  const handleCategoryChange = (cat) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === cat ? '' : cat,
    }));
  };

  const handlePriceChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: e.target.value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? 0 : rating,
    }));
  };

  const clearFilters = () => {
    setFilters({ category: '', priceRange: 1000, minRating: 0 });
  };

  return (
    <div className="w-full bg-white p-8 rounded-[2.5rem] border border-gray-100 space-y-10 sticky top-24 shadow-xl shadow-gray-100/50">
      <div className="flex justify-between items-center md:hidden">
        <h3 className="font-black text-2xl tracking-tighter">Filters</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-[10px]">Categories</h4>
          <button onClick={clearFilters} className="text-[10px] text-primary-600 font-black uppercase tracking-widest hover:underline">Reset</button>
        </div>
        <div className="space-y-3">
          {['Fashion', 'Electronics', 'Home & Decor', 'Beauty', 'Sports'].map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category === cat.toLowerCase()}
                onChange={() => handleCategoryChange(cat.toLowerCase())}
                className="w-5 h-5 rounded-lg border-gray-200 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
              />
              <span className={`text-sm transition-colors ${filters.category === cat.toLowerCase() ? 'font-black text-primary-600' : 'text-gray-500 font-medium group-hover:text-gray-900'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-[10px] mb-6">Price Range</h4>
        <input
          type="range"
          min="0"
          max="1000"
          step="50"
          value={filters.priceRange}
          onChange={handlePriceChange}
          className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary-600"
        />
        <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>$0</span>
          <span className="text-primary-600">Up to ${filters.priceRange}</span>
        </div>
      </div>

      <div>
        <h4 className="font-black text-gray-900 uppercase tracking-[0.2em] text-[10px] mb-6">Min Rating</h4>
        <div className="space-y-3">
          {[4, 3, 2].map((star) => (
            <label key={star} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={filters.minRating === star}
                onChange={() => handleRatingChange(star)}
                className="w-5 h-5 border-gray-200 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
              />
              <div className="flex items-center gap-1">
                {[...Array(star)].map((_, i) => <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />)}
                {[...Array(5-star)].map((_, i) => <Star key={i} className="w-4 h-4 text-gray-100" />)}
                <span className="text-xs font-bold text-gray-400 ml-2 uppercase tracking-widest">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
