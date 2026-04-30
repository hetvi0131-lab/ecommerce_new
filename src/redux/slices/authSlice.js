import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api/axiosConfig';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Login failed' });
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Update failed' });
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Registration failed' });
  }
});

let storedUser = null;
try {
  storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser && storedUser.email) {
    const isAdmin = storedUser.email.toLowerCase().includes('admin');
    storedUser.role = isAdmin ? 'admin' : 'user';
    localStorage.setItem('user', JSON.stringify(storedUser));
  }
} catch (e) {
  console.error("Error parsing user from localStorage", e);
}

const initialState = {
  user: storedUser,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('wishlistItems');
      localStorage.removeItem('cartItems');
      localStorage.removeItem('userOrders');
      state.user = null;
      state.token = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
        if (action.payload.token) {
          state.token = action.payload.token;
          localStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Update failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
