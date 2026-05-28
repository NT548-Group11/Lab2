export const addToCartAction = (product, selectedAttributes, quantity = 1) => ({
  type: "ADD_TO_CART",
  payload: { product, selectedAttributes, quantity },
});

export const removeFromCart = (productId, selectedAttributes) => ({
  type: "REMOVE_FROM_CART",
  payload: { productId, selectedAttributes },
});

export const updateCartItemQuantity = (productId, selectedAttributes, quantity) => ({
  type: "UPDATE_CART_ITEM",
  payload: { productId, selectedAttributes, quantity },
});

export const clearCart = () => ({
  type: "CLEAR_CART",
});

export const setCart = (cart) => ({
  type: "SET_CART",
  payload: cart,
});





