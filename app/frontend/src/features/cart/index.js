import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
function Cart1() {
const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  return (
    <>
      <Link to="/carts">
        <Badge count={totalQuantity} style={{ fontSize: '9px', height: '15px',width:'15px', minWidth: '10px', lineHeight: '16px', padding: '0 3px',marginRight: '9px'}}>
          <ShoppingCartOutlined style={{fontSize:"25px", marginRight:"10px"}} />
        </Badge>
      </Link>
    </>
  );
}
export default Cart1;
