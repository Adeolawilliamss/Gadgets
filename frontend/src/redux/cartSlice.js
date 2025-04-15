/*eslint-disable*/
import { createSlice } from '@reduxjs/toolkit';

const getParsedLocalStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const cartItem = getParsedLocalStorageItem('cartList', []);
const totalAmount = getParsedLocalStorageItem('cartTotal', 0);
const totalQuantity = getParsedLocalStorageItem('cartQuantity', 0);

const setCartListFunc = (cartItem, totalAmount, totalQuantity) => {
  localStorage.setItem('cartList', JSON.stringify(cartItem));
  localStorage.setItem('cartTotal', JSON.stringify(totalAmount));
  localStorage.setItem('cartQuantity', JSON.stringify(totalQuantity));
};

const initialState = {
  cartItem: cartItem,
  favItem: [],
  totalAmount: totalAmount,
  totalQuantity: totalQuantity,
  wishListAmount: 0,
  wishListQuantity: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItem.find(
        (item) => item.id === newItem.id,
      );
      state.totalQuantity++;
      if (!existingItem) {
        state.cartItem.push({
          id: newItem.id,
          name: newItem.name,
          img: newItem.img,
          price: newItem.price,
          oldPrice: newItem.oldPrice,
          description: newItem.description,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(newItem.price);
      }
      state.totalAmount = state.cartItem.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );
      setCartListFunc(
        state.cartItem.map((item) => item),
        state.totalAmount,
        state.totalQuantity,
      );
    },
    addToWishList: (state, action) => {
      const wishList = action.payload;
      const existingItem = state.favItem.find(
        (item) => item.id === wishList._id,
      );
      state.wishListQuantity++;
      if (!existingItem) {
        state.favItem.push({
          id: wishList._id,
          name: wishList.name,
          img: wishList.img,
          price: wishList.price,
          oldPrice: wishList.oldPrice,
          description: wishList.description,
          category: wishList.category,
          quantity: 1,
          totalPrice: wishList.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(wishList.price);
      }
      state.wishListAmount = state.favItem.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItem.find((item) => item.id === id);
      if (existingItem) {
        state.cartItem = state.cartItem.filter((item) => item.id !== id);
        state.totalQuantity -= existingItem.quantity;
      }
      state.totalAmount = state.cartItem.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );
      setCartListFunc(
        state.cartItem.map((item) => item),
        state.totalAmount,
        state.totalQuantity,
      );
    },
    clearCart: (state, action) => {
      state.cartItem = [];
      setCartListFunc([], 0, 0);
    },
    removeFromWishList: (state, action) => {
      const id = action.payload;
      state.favItem = state.favItem.filter((item) => item.id !== id);
      state.wishListQuantity--;
      state.wishListAmount = state.favItem.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0,
      );
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice.reducer;
