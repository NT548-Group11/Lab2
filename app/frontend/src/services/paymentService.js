import { post } from "../utils/request";

// Tạo đơn hàng PayOS (chuyển khoản)
export const createPayOSOrder = async (description) => {
  const response = await post("api/user/payment/create", { description });
  if (!response || response.error) {
    throw new Error(response.error || "Failed to create PayOS order");
  }
  return response;
};