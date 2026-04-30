import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api/axiosConfig';

export const placeOrder = createAsyncThunk('orders/place', async (orderData, { rejectWithValue }) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/orders/user');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchAllOrdersAdmin = createAsyncThunk('orders/fetchAllAdmin', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const savedOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
const initialState = {
  orders: savedOrders,
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.currentOrder = null;
    },
    addDemoOrder: (state, action) => {
      state.orders.unshift(action.payload);
      localStorage.setItem('userOrders', JSON.stringify(state.orders));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
        localStorage.setItem('userOrders', JSON.stringify(state.orders));
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to place order';
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        localStorage.setItem('userOrders', JSON.stringify(action.payload));
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        // Keep the orders we already have (from localStorage)
      });
  },
});

export const { clearOrder, addDemoOrder } = orderSlice.actions;
export default orderSlice.reducer;
