import { Col, Row } from "antd";
import ProductItem from "./ProductItem";

const ProductList=(props) => {
  const { products } = props;
  return (
    <>
      <Row gutter={[20, 20]} className="products-page__grid">
        {products.map((item) => (
          <Col span={6} key={item.id} className="products-page__item">
              <ProductItem item={item} />
          </Col>
        ))}
      </Row>
    </>
  );
}
export default ProductList;
