import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import Skeleton from '../components/common/Skeleton';
import Button from '../components/common/Button';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items: products, loading, pagination } = useSelector((state) => state.products);
  
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: 10000,
    minRating: 0,
    sort: 'newest'
  });

  useEffect(() => {
    dispatch(fetchProducts({
      page: searchParams.get('page') || 1,
      category: filters.category,
      price_lte: filters.priceRange,
      rating_gte: filters.minRating,
      sort: filters.sort,
      q: searchParams.get('search') || ''
    }));
  }, [dispatch, searchParams, filters]);

  const handlePageChange = (newPage) => {
    setSearchParams({ ...Object.fromEntries(searchParams), page: newPage });
  };

  const handleSortChange = (e) => {
    setFilters({ ...filters, sort: e.target.value });
  };

  const displayedProducts = products.filter(p => {
    const categoryMatch = !filters.category || p.category.toLowerCase() === filters.category.toLowerCase();
    const priceMatch = p.price <= filters.priceRange;
    const ratingMatch = (p.rating || 4.5) >= filters.minRating;
    const searchMatch = !searchParams.get('search') || 
      p.name.toLowerCase().includes(searchParams.get('search').toLowerCase());
    
    return categoryMatch && priceMatch && ratingMatch && searchMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-72 flex-shrink-0">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <div>
              <h1 className="text-3xl font-black text-gray-900 capitalize tracking-tighter">
                {filters.category || 'All Collections'}
              </h1>
              <p className="text-sm text-gray-400 font-medium">{displayedProducts.length} items discovered (Total in state: {products.length})</p>

            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-primary-600' : 'text-gray-400'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                   onClick={() => setViewMode('list')}
                   className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-primary-600' : 'text-gray-400'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <select 
                value={filters.sort}
                onChange={handleSortChange}
                className="flex-1 sm:flex-none bg-white border border-gray-100 rounded-2xl px-6 py-2.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm cursor-pointer hover:border-primary-200 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              <button 
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden p-2.5 bg-white border border-gray-100 rounded-xl text-gray-600 shadow-sm"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] rounded-[2rem]" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' : 'grid-cols-1 gap-6'}`}>
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="max-w-xs mx-auto space-y-6">
                <div className="p-8 bg-gray-50 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                   <Filter className="w-12 h-12 text-gray-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">No results found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your filters or search query to discover new products.</p>
                <Button onClick={() => setFilters({ category: '', priceRange: 1000, minRating: 0, sort: 'newest' })} variant="outline" className="rounded-full px-8">
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-12">
              <Button 
                variant="outline" 
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="w-12 h-12 p-0 rounded-2xl shadow-sm hover:shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              {[...Array(pagination.pages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={pagination.page === i + 1 ? 'primary' : 'outline'}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-12 h-12 p-0 rounded-2xl font-bold transition-all ${pagination.page === i + 1 ? 'shadow-lg shadow-primary-500/30' : 'shadow-sm'}`}
                >
                  {i + 1}
                </Button>
              ))}
              <Button 
                variant="outline" 
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="w-12 h-12 p-0 rounded-2xl shadow-sm hover:shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl animate-slide-in-right">
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              onClose={() => setShowMobileFilters(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
