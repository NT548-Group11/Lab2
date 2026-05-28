import { get, post, put, del } from "../utils/request";

// Lấy tất cả đơn hàng
export const getOrders = () => get("api/order");

// Lấy chi tiết một đơn hàng theo khách hàng
export const getOrderById = (id) => get(`api/user/order`);

// Lấy chi tiết một đơn hàng theo id
export const getOrderByIdAdmin = (id) => get(`api/order/${id}`);
// Tạo mới đơn hàng
export const createOrder = (data) => post("api/user/order", data);

// Cập nhật đơn hàng
export const updateOrder = (id, data) => put(`api/user/order/${id}`, data);

// Xóa đơn hàng
export const deleteOrder = (id) => del(`api/order/${id}`);