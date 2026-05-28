import React, { useEffect, useState } from "react";
import { Table, Tag, Spin } from "antd";
import { getOrder } from "../../../services/usersServices";

const statusColors = {
  "Cash on Delivery": "blue",
  "Delivered": "green",
  "Processing": "orange",
  "Cancelled": "red",
};

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await getOrder();
        setOrders(Array.isArray(res) ? res : res.orders || []);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <span style={{ fontWeight: 500 }}>{id.slice(-6).toUpperCase()}</span>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => amount?.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => (
        <Tag color={statusColors[status] || "default"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {products?.map((item, idx) => (
            <li key={idx}>{item.title || item.product?.title || "Sản phẩm"} x{item.quantity}</li>
          ))}
        </ul>
    }
  ];

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <h2>Lịch sử đơn hàng</h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
}

export default UserOrders;