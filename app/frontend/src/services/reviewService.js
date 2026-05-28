import { get, post } from "../utils/request";

export const addReview = async (productId, rating, comment) => {
    const payload = { productId, rating, comment };
  try {
    const response = await post("api/reviews/create", payload);
    return response;
  } catch (error) {
    throw new Error(error?.message || "Failed to add review");
  }
};

export const getReviewsByProduct = async (productId) => {
    const response = await get(`api/reviews/${productId}`);
    return response;
}