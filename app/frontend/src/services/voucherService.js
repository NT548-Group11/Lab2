import { del, get, patch, post } from "../utils/request";
export const getVouchers = async () => {
   return await get("api/coupon");
};