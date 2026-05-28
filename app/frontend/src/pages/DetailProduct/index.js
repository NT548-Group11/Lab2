import {
  Row,
  Col,
  Image,
  Space,
  Typography,
  Radio,
  Button,
  Collapse,
  Tag,
  Rate,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { getProductList, getProductById } from "../../services/productsService";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./DetailProduct.scss";
import ProductItem from "../Products/ProductItem";
import ProductReviews from "./productReviews";
import { addToCart } from "../../services/cartService";
import { addToCartAction } from "../../actions/cart";

const { Title, Text } = Typography;

function DetailProduct() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [similarProduct, setSimilarProduct] = useState([]);
  const [images, setImages] = useState([]);
  const [mainImgIndex, setMainImgIndex] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const handleAddToCart = async () => {
    try {
      addToCart(product._id, 1, selectedAttributes);
      dispatch(addToCartAction(product, selectedAttributes, 1));

      notification.success({
        description: "Thêm sản phẩm vào giỏ hàng thành công!",
        className: "custom-notification__success",
        placement: "topRight",
        duration: 2,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const product = await getProductById(id);

        setProduct(product);
        setImages(product.images || []);

        const allProducts = await getProductList();

        const similar = allProducts.filter(
          (item) =>
            item.category?._id === product.category?._id &&
            item._id !== product._id,
        );

        setSimilarProduct(similar.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAttributeChange = (attributeName, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  useEffect(() => {
    console.log(product);
    console.log(product.category);
  });
  return (
    <>
      <div className="section1">
        <Row gutter={[60, 16]} className="detail-product">
          {/* Image Section */}
          <Col span={14} className="detail-product__img">
            <Row gutter={[3, 3]}>
              <Col span={4} className="thumbnail-gallery">
                <Space
                  direction="vertical"
                  size="middle"
                  className="thumbnail-images"
                >
                  {images.map((img, index) => (
                    <Image
                      className="thumbnail-image"
                      key={index}
                      preview={false}
                      src={img}
                      onClick={() => setMainImgIndex(index)}
                    />
                  ))}
                </Space>
              </Col>
              <Col span={20} className="main-image-wrapper">
                <Image
                  className="main-image"
                  preview={false}
                  width="100%"
                  src={images[mainImgIndex] || images[0]}
                />
              </Col>
            </Row>
          </Col>
          {/*Title, sold, rate */}
          <Col span={10} className="detail-product__info">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={3} className="product-title">
                  {product.title}
                </Title>
              </Col>

              <Col className="product-description">
                <div>Đã bán: {product.sold}</div>
                <div>Đánh giá:</div>
                <Rate
                  allowHalf
                  disabled
                  value={parseFloat(product.totalRating)}
                />{" "}
                <div style={{ marginLeft: "10px" }}>
                  {product.totalRating} / 5
                </div>
              </Col>

              <Col span={24} className="product-price">
                <div className="product-price__current">
                  <Text
                    strong
                    style={{
                      color: "red",
                      fontSize: "24px",
                      marginRight: "10px",
                    }}
                  >
                    {(
                      (product.price * (100 - product.discountPercentage)) /
                      100
                    ).toFixed(0)}
                    đ
                  </Text>
                  <br />
                  <Text delete style={{ color: "gray", fontSize: "18px" }}>
                    {product.price} đ
                  </Text>
                </div>

                <br />
                <Tag color="red" style={{ fontSize: 14 }}>
                  Giảm: {product.discountPercentage}%
                </Tag>
              </Col>

              <Col span={24} className="product-attributes">
                {product.category?.attributes?.map((attribute) => (
                  <div key={attribute._id} className="attribute-group">
                    <Text strong style={{ fontSize: "16px" }}>
                      {attribute.name}:
                    </Text>

                    <Radio.Group
                      style={{ marginTop: 8 }}
                      value={selectedAttributes[attribute.name]}
                      onChange={(e) =>
                        handleAttributeChange(attribute.name, e.target.value)
                      }
                    >
                      {attribute.values.map((value, index) => (
                        <Radio.Button key={index} value={value}>
                          {value}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  </div>
                ))}
              </Col>

              <Col span={24}>
                <Button
                  type="primary"
                  block
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Collapse
        defaultActiveKey={["1"]}
        items={
          product.description?.map((desc, index) => ({
            key: `${index + 1}`,
            label: `Chi tiết ${index + 1}`,
            children: <p>{desc.content || desc}</p>,
          })) || []
        }
        className="detail-product-3"
      />

      <ProductReviews
        productId={product._id}
        // onAverageRatingChange={handleAverageRatingChange}
      />

      <div className="section3-title">Sản Phẩm Tương Tự</div>
      <Row gutter={[20, 20]} className="similar-products">
        {similarProduct.map((item) => (
          <Col span={4} key={item._id} className="product-item">
            <ProductItem item={item} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default DetailProduct;
