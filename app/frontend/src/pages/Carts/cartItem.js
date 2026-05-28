import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCartItem, deleteCartItem } from "../../services/cartService";
import "./Carts.scss";
import {removeFromCart,updateCartItemQuantity} from "../../actions/cart";

function CartItem({ item, refreshCart }) {
  const dispatch = useDispatch();
  const price = item.price.toLocaleString();
  const handleUp = async () => {
    try {
      await updateCartItem(
        item.product._id,
        item.quantity + 1,
        item.selectedAttributes
      ); // Tăng số lượng
      dispatch(updateCartItemQuantity(item.product._id, item.selectedAttributes, item.quantity + 1))
      refreshCart(); // Làm mới giỏ hàng
    } catch (error) {}
  };

  const handleDown = async () => {
    try {
      if (item.quantity > 1) {
        await updateCartItem(
          item.product._id,
          item.quantity - 1,
          item.selectedAttributes
        ); 
         dispatch(updateCartItemQuantity(item.product._id, item.selectedAttributes, item.quantity - 1));
        refreshCart();
      }
    } catch (error) {}
  };

  const handleDelete = async () => {
    try {
      await deleteCartItem(item.product._id, item.selectedAttributes);
      dispatch(removeFromCart(item.product._id, item.selectedAttributes));
      refreshCart();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div
      className="cart__item"
      key={`${item.product._id}-${JSON.stringify(item.selectedAttributes)}`}
    >
      {/* Ảnh */}
      <Link to={`/products/${item.product._id}`}>
        <img className="img" src={item.product.images[0]} alt={item.product.name} />
      </Link>
      {/* Tên sản phẩm */}
      <Link to={`/products/${item.product._id}`} className="cart__title">
        {item.product.title}
      </Link>
      {/* Thuộc tính đã chọn */}
      <div className="cart__attributes">
        {Object.entries(item.selectedAttributes).map(([key, value]) => (
          <div key={key} className="cart__attribute">
            <span>{key}:</span> <span>{value}</span>
          </div>
        ))}
      </div>
      {/* Đơn giá */}
      <div className="cart__price">
        <div className="cart__price--new">{price} VND</div>
      </div>
      {/* Số lượng */}
      <div className="cart__quantity">
        <button onClick={handleDown} disabled={item.quantity <= 1}>
          -
        </button>
        <input min={1} value={item.quantity} readOnly />
        <button onClick={handleUp}>+</button>
      </div>
      {/* Tổng tiền */}
      <div className="cart__total">
        {(item.price * item.quantity).toLocaleString()} VND
      </div>
      {/* Xóa sản phẩm */}
      <div className="cart__remove">
        <button onClick={handleDelete}>Xóa</button>
      </div>
    </div>
  );
}

export default CartItem;
