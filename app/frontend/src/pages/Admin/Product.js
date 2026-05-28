import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Card, Row, Col, Button, Input, Pagination } from "antd";
import { PlusOutlined, EllipsisOutlined, SearchOutlined } from "@ant-design/icons";
import { getProductList } from "../../services/productsService";

const { Meta } = Card;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  useEffect(() => {
    async function fetchProducts() {
      const res = await getProductList();
      setProducts(res || []);
    }
    fetchProducts();
  }, []);

  // Lọc sản phẩm theo tên 
  const filteredProducts = products.filter((item) =>
    (item.title?.toLowerCase().includes(search.toLowerCase()))
  );

  // Phân trang
  const pagedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  // Hàm lấy ảnh đầu tiên (tùy cấu trúc dữ liệu)
  const getFirstImage = (product) => {
    if (Array.isArray(product.images)) {
      if (typeof product.images[0] === "string") {
        return product.images[0];
      }
      if (typeof product.images[0] === "object" && product.images[0]?.url) {
        return product.images[0].url;
      }
    }
    return "https://via.placeholder.com/150";
  };

  // Hàm lấy tên category (tùy cấu trúc dữ liệu)
  const getCategoryName = (category) => {
    if (!category) return "Category";
    if (typeof category === "string") return category;
    if (typeof category === "object" && category.name) return category.name;
    return "Category";
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Quản lí sản phẩm</h2>
          <div style={{ color: "#888" }}>Dashboard &gt; Quản lí sản phẩm</div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search product..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 220 }}
          />
          <NavLink to="add-product">
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm sản phẩm mới
            </Button>
          </NavLink>
        </div>
      </div>
      <Row gutter={[16, 16]}>
        {pagedProducts.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
            <Card
              cover={
                <img
                  alt={product.title}
                  src={getFirstImage(product)}
                  style={{ height: 140, objectFit: "cover" }}
                />
              }
              actions={[
                <NavLink to={`${product._id}`}>
                  <EllipsisOutlined key="more" />
                </NavLink>
              ]}
              style={{ borderRadius: 10 }}
            >
              <Meta
                title={
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{product.title || "Lorem Ipsum"}</span>
                    <span style={{ fontWeight: 600 }}>
                      {product.price ? `₫${product.price}` : "₫0"}
                    </span>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: 8, color: "#888" }}>
                      {getCategoryName(product.category)}
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      {product.description?.slice(0, 60) || "Summary"}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <div>
                        <div>Đã bán</div>
                        <div style={{ color: "#faad14" }}>{product.sold ?? 1269}</div>
                      </div>
                      <div>
                        <div>Sản phẩm còn lại</div>
                        <div style={{ color: "#52c41a" }}>{product.quantity ?? 1269}</div>
                      </div>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: 32, textAlign: "center" }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredProducts.length}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Product;