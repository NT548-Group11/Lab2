import { del, get, patch, post } from "../utils/request";

export const addToCart = async (productId, quantity = 1, selectedAttributes = {}) => {
  const payload = {
    productId,
    quantity,
    selectedAttributes,
  };
  const response = await post("api/cart/add", payload);
  return response;
};

export const getCart = async () => {
  const response = await get("api/cart/user");
  console.log("User Cart:", response);
  if (!response || response.error) {
    throw new Error(response.error || "Failed to fetch cart");
  }
  return response; 
};

export const updateCartItem = async (productId, quantity,selectedAttributes={}) => {
  const payload = { productId, quantity,selectedAttributes };
  const response = await patch("api/cart/update", payload);
  return response;
};

export const deleteCartItem = async (productId,selectedAttributes) => {
  const payload = { selectedAttributes };
  const response = await del(`api/cart/delete/${productId}`,payload);
  if (!response || response.error) {
    throw new Error(response.error || "Failed to delete cart item");
  }
  return response;
};

export const clearCart = async () => {
  const response = await del("api/cart/clear");
  if (!response || response.error) {
    throw new Error(response.error || "Failed to clear cart");
  }
  return response;
};

export const getAddressList = async () => {
  const response = await get("api/address/all-address"); // Gọi API lấy danh sách địa chỉ
  // console.log("res",response);
  if (!response || response.error) {
    throw new Error(response.error || "Failed to fetch address list");
  }
  return response; // Trả về danh sách địa chỉ từ backend
};