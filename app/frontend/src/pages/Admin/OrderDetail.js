import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Button, Spin } from "antd";
import { useParams } from "react-router-dom";
import { getOrderByIdAdmin } from "../../services/orderService";
import { getUserById } from "../../services/usersServices";
import { getProductById } from "../../services/productsService";

const statusColors = {
  Success: "green",
  Pending: "blue",
  Cancel: "red",
  Completed: "green",
  "Cash on Delivery": "blue",
  "Đã giao hàng": "green",
  "Đang xử lý": "orange",
  "Đã hủy": "red",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
        setLoading(true);
        try {
        const res = await getOrderByIdAdmin(id);
        // Lấy thông tin user nếu orderBy là id
        if (res?.orderBy && typeof res.orderBy === "string") {
            const userRes = await getUserById(res.orderBy);
            setUser(userRes);
        } else if (res?.orderBy && typeof res.orderBy === "object") {
            setUser(res.orderBy);
        }

        // Lấy thông tin sản phẩm cho từng item
        if (Array.isArray(res.products)) {
            const productsWithDetail = await Promise.all(
            res.products.map(async (item) => {
                let productDetail = {};
                try {
                productDetail = await getProductById(item.product);
                } catch (e) {}
                return {
                ...item,
                product: productDetail,
                };
            })
            );
            setOrder({ ...res, products: productsWithDetail });
        } else {
            setOrder(res);
        }
        } catch (err) {
        setOrder(null);
        setUser(null);
        }
        setLoading(false);
    }
    fetchOrder();
    }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 64 }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!order) return <div>Đang tải...</div>;

  // Ưu tiên lấy thông tin user từ state user
  const orderUser = user?.getaUser || user || order.orderBy || {};

  // Tính toán giá trị
  const subTotal = order.totalAmount || 0;
  const shipping = 0;
  const tax = Math.round(subTotal * 0.18);
  const total = subTotal + shipping + tax;

  return (
    <div style={{ padding: 24, background: "#f6f7fb", minHeight: "100vh" }}>
      <Row gutter={24}>
                <Col span={16}>
          <Card style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 500, fontSize: 16 }}>
                Order No : <span style={{ color: "#ff4d4f" }}>#{order._id?.slice(-7)}</span>
              </span>
              <Tag color={statusColors[order.orderStatus] || "default"} style={{ marginLeft: 16 }}>
                {order.orderStatus === "Success" ? "Completed" : order.orderStatus}
              </Tag>
            </div>
            <Row gutter={24}>
              <Col span={12}>
                <div>
                  <b>Order Created at</b>
                  <div>{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <b>Tên khách hàng</b>
                  <div>
                    {orderUser.fullname ||
                      [orderUser.firstname, orderUser.lastname].filter(Boolean).join(" ") ||
                      "Tên khách"}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <b>Email</b>
                  <div>{orderUser.email || "Chưa có email"}</div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <b>Số điện thoại</b>
                  <div>{orderUser.mobile || "Chưa có số điện thoại"}</div>
                </div>
              </Col>
            </Row>
            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Card size="small" title="Delivery Address">
                  <div>
                    {orderUser.fullname ||
                      [orderUser.firstname, orderUser.lastname].filter(Boolean).join(" ") ||
                      "Tên khách"}{" "}
                    | {orderUser.mobile || ""}
                    <br />
                    {typeof orderUser.address === "object"
                      ? `${orderUser.address.address || ""}${
                          orderUser.address.detail_address
                            ? ", " + orderUser.address.detail_address
                            : ""
                        }`
                      : orderUser.address || "Chưa có địa chỉ"}
                  </div>
                </Card>
              </Col>
            </Row>
            {/* Price section moved here */}
            <Card style={{ marginTop: 24 }}>
              <h3>Thông tin đơn hàng</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontWeight: 500 }}>Tổng tiền:</span>
                <span style={{ fontWeight: 700, color: "#ff4d4f" }}>
                  {(order.totalAmount || 0).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 500 }}>Trạng thái:</span>
                <Tag color={statusColors[order.orderStatus] || "default"}>
                  {order.orderStatus === "Success" ? "Completed" : order.orderStatus}
                </Tag>
              </div>
            </Card>
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 32, background: "#f8f8ff", border: "none" }}>
        <h3 style={{ marginBottom: 16 }}>Order Items</h3>
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              fontWeight: 600,
              background: "#f6f7fb",
              padding: "16px 24px",
              borderBottom: "1px solid #f0f0f0",
            }}
          >

            <div style={{ flex: 2 }}>Tên</div>
            <div style={{ flex: 1, textAlign: "center" }}>SỐ LƯỢNG</div>
            <div style={{ flex: 1, textAlign: "right" }}>GIÁ</div>
            <div style={{ flex: 1, textAlign: "right" }}>TỔNG</div>
          </div>
          {(order.products || []).map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "18px 24px",
                borderBottom:
                  idx === order.products.length - 1 ? "none" : "1px solid #f0f0f0",
                background: idx % 2 === 0 ? "#fff" : "#fafaff",
              }}
            >
                <div style={{ flex: 2, fontWeight: 500 }}>
                    {console.log("item.product?.title:", item.product?.title)}
                    {item.product?.title || "Sản phẩm"}
                </div>
              <div style={{ flex: 1, textAlign: "center" }}>{item.quantity}</div>
              <div style={{ flex: 1, textAlign: "right" }}>
                {item.price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
              <div style={{ flex: 1, textAlign: "right", fontWeight: 600 }}>
                {(item.price * item.quantity).toLocaleString("en-US", {
                  style: "currency",
                  currency: "VND",
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default OrderDetail;