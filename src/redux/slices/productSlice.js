import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api/axiosConfig';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch products' });
  }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue, getState }) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    // Fallback to mock data if backend is down
    const state = getState();
    const product = state.products.items.find(p => p.id.toString() === id.toString());
    if (product) return product;
    return rejectWithValue(error.response?.data || { message: 'Product not found' });
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to create product' });
  }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to delete product' });
  }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to update product' });
  }
});

const defaultProducts = [
  { id: 1, name: 'Premium Leather Jacket', price: 299.99, category: 'fashion', image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=500', rating: 4.8, reviews: 124, stock: 15 },
  { id: 2, name: 'Wireless Noise Cancelling Headphones', price: 199.50, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=500', rating: 4.9, reviews: 850, stock: 20 },
  { id: 3, name: 'Minimalist Wall Clock', price: 45.00, category: 'home & decor', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=500', rating: 4.5, reviews: 320, stock: 50 },
  { id: 4, name: 'Natural Silk Scarf', price: 89.00, category: 'fashion', image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=500', rating: 4.7, reviews: 95, stock: 10 },
  { id: 5, name: 'Smart Fitness Tracker', price: 129.99, category: 'electronics', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=500', rating: 4.6, reviews: 2100, stock: 35 },
  { id: 6, name: 'Ceramic Flower Vase', price: 35.00, category: 'home & decor', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=500', rating: 4.4, reviews: 150, stock: 45 },
  { id: 7, name: 'Luxury Scented Candle', price: 25.00, category: 'beauty', image: 'https://images.unsplash.com/photo-1602872030219-cbf917a8cbd0?auto=format&fit=crop&q=80&w=500', rating: 4.8, reviews: 540, stock: 100 },
  { id: 8, name: 'Pro Camera Tripod', price: 75.00, category: 'electronics', image: 'https://images.unsplash.com/photo-1590605272619-3f89aa0650ef?auto=format&fit=crop&q=80&w=500', rating: 4.7, reviews: 88, stock: 12 },
];



const initialState = {
  items: [],
  categories: ['fashion', 'electronics', 'home & decor', 'beauty', 'sports', 'jewellery'],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    total: 8,
    page: 1,
    limit: 10,
    pages: 1
  },
  filters: {
    category: '',
    priceRange: 10000,
    minRating: 0,
    sort: 'newest'
  }
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          state.pagination.total = action.payload.length;
        } else if (action.payload?.products) {
          state.items = action.payload.products;
          state.pagination = {
            ...action.payload.pagination,
            total: action.payload.products.length
          };
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch products';
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch product';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create product';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const deletedId = action.payload?.toString();
        state.items = state.items.filter(item => 
          (item._id?.toString() !== deletedId) && (item.id?.toString() !== deletedId)
        );
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        if (!action.payload?._id) return;
        const updatedId = action.payload._id.toString();
        const index = state.items.findIndex(item => 
          (item._id?.toString() === updatedId) || (item.id?.toString() === updatedId)
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearSelectedProduct, addProduct } = productSlice.actions;
export default productSlice.reducer;
