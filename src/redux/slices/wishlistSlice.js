import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('wishlistItems')) || [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      const exists = state.items.find((item) => item.id === newItem.id);
      if (!exists) {
        state.items.push(newItem);
        localStorage.setItem('wishlistItems', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    toggleWishlist: (state, action) => {
      const item = action.payload;
      const index = state.items.findIndex((i) => i.id === item.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(item);
      }
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    }
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
