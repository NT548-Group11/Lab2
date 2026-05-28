import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CartItem from "./cartItem";




function CartList({cart,refreshCart}) {

  return (
    <div>
      <div className="cart">
        {cart.length > 0 ? (
          cart.map((item) => (
            <CartItem item={item} key={item._id} refreshCart={refreshCart} />
          ))
        ) : (
          <p>Giỏ hàng trống</p>
        )}
      </div>
    </div>
  );
}

export default CartList;