import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
      
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
