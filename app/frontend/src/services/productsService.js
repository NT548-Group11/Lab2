import {get,put, post, del } from '../utils/request';

export const getProductList = async()=>{
    return await get("api/product");
}

export const getProductById = async (id) => {
  const response = await get(`api/product/${id}`);
  if (!response || response.error) {
    throw new Error(response.error || "Failed to fetch product data");
  }
  return response;
};

export const createProduct = async (data) => {
  const response = await post("api/product", data);
  if (!response || response.error) {
    throw new Error(response.error || "Failed to create product");
  }
  return response;
};

export const updateProduct = async (id, data) => {
  const response = await put(`api/product/${id}`, data);
  if (!response || response.error) {
    throw new Error(response.error || "Failed to update product data");
  }
  return response;
};

export const deleteProduct = async (id) => {
  const response = await del(`api/product/${id}`);
  if (!response || response.message) {
    throw new Error(response.message || "Failed to delete product");
  }
  return response;
};

export const getCategoryAttributes = async (categoryId) => {
  const response = await get(`api/category/${categoryId}/attributes`);
  if (!response || response.error) {
    throw new Error(response.error || "Failed to fetch category attributes");
  }
  return response;
};


