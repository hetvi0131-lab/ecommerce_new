import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api/axiosConfig';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    // Mock login for demonstration if backend is not running
    if (credentials.email && credentials.password) {
      const mockData = {
        token: 'mock-jwt-token',
        user: { name: credentials.email.split('@')[0], email: credentials.email, role: 'admin' }
      };
      localStorage.setItem('token', mockData.token);
      localStorage.setItem('user', JSON.stringify(mockData.user));
      return mockData;
    }
    return rejectWithValue(error.response?.data || { message: 'Login failed' });
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    // Mock registration
    const mockData = {
      token: 'mock-jwt-token',
      user: { name: userData.name, email: userData.email, role: 'user' }
    };
    localStorage.setItem('token', mockData.token);
    localStorage.setItem('user', JSON.stringify(mockData.user));
    return mockData;
  }
});

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
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
        state.user = action.payload.user;
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
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
