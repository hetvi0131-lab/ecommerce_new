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

const initialState = {
  orders: [],
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
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to place order';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
