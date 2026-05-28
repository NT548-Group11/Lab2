import { get, post, put, del } from "../utils/request";

// Lấy tất cả blog
export const getBlogs = () => get("api/blog");

// Lấy chi tiết một blog theo id
export const getBlogById = (id) => get(`api/blog/${id}`);

// Tạo mới blog
export const createBlog = (data) => post("api/blog", data);

// Cập nhật blog
export const updateBlog = (id, data) => put(`api/blog/${id}`, data);

// Xóa blog
export const deleteBlog = (id) => del(`api/blog/${id}`); 