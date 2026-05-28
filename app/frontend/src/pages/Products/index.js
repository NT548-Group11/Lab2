import { useEffect, useState } from "react";
import { Row, Col, Pagination, Input, Button, Empty, Select } from "antd";
import { getProductList } from "../../services/productsService";
import "./Products.scss";
import ProductList from "./ProductList";

function Product() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const prices = [
    {
      value: "",
      label: "Mặc định",
    },
    {
      value: "priceAsc",
      label: "Giá thấp đến cao",
    },
    {
      value: "priceDesc",
      label: "Giá cao đến thấp",
    },
    {
      value: "discount",
      label: "Giảm giá nhiều",
    },
  ];

useEffect(() => {
  const fetchApi = async () => {
    const res = await getProductList();
    console.log("Fetched products:", res);
    setProducts(res);
    setFilteredProducts(res);

    const uniqueCategories = [
      { value: "all", label: "Tất cả" }, // Default "all" option
      ...Array.from(
        new Set(
          res
            .map((item) => item.category?.name) // Extract the `name` field from `category`
            .filter((name) => typeof name === "string" && name.trim() !== "") // Ensure valid strings
        )
      ).map((name) => ({
        value: name,
        label: name, // Use the `name` field for both value and label
      })),
    ];
    setCategories(uniqueCategories);
  };
  fetchApi();
}, []);

  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };
  //Search
  const handleSearch = () => {
  const normalizedSearchTerm = removeAccents(searchTerm);
  
  const filtered = products.filter((item) =>
    removeAccents(item.title).includes(normalizedSearchTerm)
  );
  
  // console.log("Filtered products:", filtered);
  setFilteredProducts(filtered);
};

  const handleSortChange = (e) => {
    setSortBy(e);
    setCurrentPage(1);
  };
  
  const handleCategoryChange = (category) => {
    if (category === "all") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((item) => item.category?.name === category);
      setFilteredProducts(filtered);
    }
    setCurrentPage(1);
  };

  const handlePageChange = (e) => {
    setCurrentPage(e);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceAsc") {
      return a.price - b.price;
    }
    if (sortBy === "priceDesc") {
      return b.price - a.price;
    }
    if (sortBy === "discount") {
      return b.discountPercentage - a.discountPercentage; 
    }
    return 0;
  });

  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <>
      <div className="products-page">
        <h2 className="products-page__title">Danh sách sản phẩm</h2>
        <Row gutter={[20, 20]} className="product-page__layout">
          <Col span={4} className="products-page__filter">
            <div className="search">Tìm kiếm </div>
            <div className="products-page__search">
              <Input
                placeholder="Tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button onClick={handleSearch}>Tìm</Button>
            </div>
            <div>
              <div className="search">Phân loại:</div>
              <Select
                className="Select"
                showSearch
                placeholder="Phân loại:"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={categories}
                onChange={(value) => handleCategoryChange(value)}
              />
            </div>
            <div>
              <div className="search">Sắp xếp theo:</div>
              <Select
                className="Select"
                showSearch
                placeholder="Giá:"
                options={prices}
                onChange={handleSortChange}
              />
            </div>
          </Col>
          <Col span={20} className="products-page__list">
            {currentProducts.length > 0 ? (
              <ProductList products={currentProducts} />
            ) : (
              <Empty />
            )}
          </Col>
        </Row>
      </div>
      <Pagination
        align="center"
        defaultCurrent={1}
        current={currentPage}
        pageSize={pageSize}
        total={filteredProducts.length}
        onChange={handlePageChange}
      />
    </>
  );
}
export default Product;
