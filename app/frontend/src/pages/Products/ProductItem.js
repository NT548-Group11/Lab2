import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./Products.scss";
import { Tag } from "antd";
function ProductItem(props) {
  const { item } = props;
  return (
    <>
      <div className="product" key={item._id}>
        <NavLink to={item._id ? `/products/${item._id}` : "#"}>
          <img
            className="product__image"
            src={item.images[0]}
            alt="anh san pham"
          />
          <div className="product__info">
            <div className="product__title"> {item.title}</div>
            <h3 className="product__title">{item.name}</h3>
            <div className="product__price">
              <p className="product__price--new">
                {Math.round(
                  (item.price * (100 - item.discountPercentage)) / 100
                ).toLocaleString("vi-VN")}{" "}
                đ
              </p>
              <p className="product__price--old">
                {item.price.toLocaleString("vi-VN")} đ
              </p>
            </div>

            <Tag className="product__percent">
              Giảm {item.discountPercentage}%
            </Tag>
          </div>
        </NavLink>
      </div>
    </>
  );
}
export default ProductItem;
