const cartReducer = (state = { products: [], totalQuantity: 0 }, action) => {
  switch (action.type) {
    case "SET_CART":
      const totalQuantity = action.payload.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return {
        ...state,
        products: action.payload.products,
        totalQuantity,
      };
    case "SET_TOTAL_QUANTITY":
      return {
        ...state,
        totalQuantity: action.payload,
      };
    case "ADD_TO_CART":
      const existingItemIndex = state.products.findIndex(
        (item) =>
          item.product._id === action.payload.product._id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(action.payload.selectedAttributes)
      );

      let updatedProducts;
      if (existingItemIndex !== -1) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        updatedProducts = [...state.products];
        updatedProducts[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        updatedProducts = [
          ...state.products,
          { ...action.payload, quantity: action.payload.quantity },
        ];
      }

      return {
        ...state,
        products: updatedProducts,
        totalQuantity: updatedProducts.reduce(
          (sum, item) => sum + item.quantity,
          0
        ), // Tính tổng số lượng
      };

    case "REMOVE_FROM_CART":
      const filteredProducts = state.products.filter(
        (item) =>
          item.product._id !== action.payload.productId ||
          JSON.stringify(item.selectedAttributes) !==
            JSON.stringify(action.payload.selectedAttributes)
      );

      return {
        ...state,
        products: filteredProducts,
        totalQuantity: filteredProducts.reduce(
          (sum, item) => sum + item.quantity,
          0
        ), // Tính tổng số lượng
      };

    case "UPDATE_CART_ITEM":
      const updatedCart = state.products.map((item) =>
        item.product._id === action.payload.productId &&
        JSON.stringify(item.selectedAttributes) ===
          JSON.stringify(action.payload.selectedAttributes)
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      return {
        ...state,
        products: updatedCart,
        totalQuantity: updatedCart.reduce(
          (sum, item) => sum + item.quantity,
          0
        ), // Tính tổng số lượng
      };

    case "CLEAR_CART":
      return {
        products: [],
        totalQuantity: 0, // Xóa toàn bộ sản phẩm
      };

    default:
      return state;
  }
};

export default cartReducer;
