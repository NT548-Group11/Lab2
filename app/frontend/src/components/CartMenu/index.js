import { NavLink } from "react-router-dom";

function CartMenu() {
    const cart = useSelector((state) => state.cartReducer);
    const totalQuantity = cart.reduce((total, item) => {
        return total + item.quantity;
    });
  return (
    <>
        <NavLink to="/carts">Gio hang({totalQuantity})</NavLink>
    </>
  );
}
export default CartMenu;