import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Input, Popconfirm, message, Select } from "antd";
import { getOrders, updateOrder, deleteOrder } from "../../services/orderService";
import { getUserById } from "../../services/usersServices";
import { ReloadOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Thêm dòng này

const { Option } = Select;

const statusColors = {
  "Cash on Delivery": "blue",
  "Đã giao hàng": "green",
  "Đang xử lý": "orange",
  "Đã hủy": "red",
};

const OrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const navigate = useNavigate(); // Thêm dòng này

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const res = await getOrders();
        let orderList = Array.isArray(res) ? res : res.orders || [];
        // Lấy thông tin user cho từng order
        orderList = await Promise.all(orderList.map(async (order) => {
          if (order.orderBy && typeof order.orderBy === "string") {
            try {
              const user = await getUserById(order.orderBy);
              return { ...order, orderBy: user };
            } catch {
              return { ...order, orderBy: null };
            }
          }
          return order;
        }));
        setOrders(orderList);
      } catch (err) {
        message.error("Không thể tải danh sách đơn hàng!");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [refresh]);

  const handleDelete = async (orderId) => {
    try {
      await deleteOrder(orderId);
      message.success("Đã xóa đơn hàng");
      setRefresh(r => !r);
    } catch {
      message.error("Xóa đơn hàng thất bại!");
    }
  };

  const handleEditStatus = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setEditingStatus(currentStatus);
  };

  const handleSaveStatus = async (orderId) => {
    try {
      await updateOrder(orderId, { orderStatus: editingStatus });
      message.success("Cập nhật trạng thái thành công!");
      setEditingOrderId(null);
      setRefresh(r => !r);
    } catch {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <span style={{ fontWeight: 500 }}>{id.slice(-6).toUpperCase()}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "orderBy",
      key: "orderBy",
      render: (orderBy) =>
        orderBy?.fullname
          ? orderBy.fullname
          : orderBy?.getaUser?.fullname
            ? orderBy.getaUser.fullname
            : "N/A",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => amount?.toLocaleString("vi-VN") + " ₫",
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status, record) =>
        editingOrderId === record._id ? (
          <Space>
            <Select
              value={editingStatus}
              onChange={setEditingStatus}
              style={{ width: 140 }}
              size="small"
            >
              <Option value="Cash on Delivery">Chờ giao hàng</Option>
              <Option value="Đã giao hàng">Đã giao hàng</Option>
              <Option value="Đang xử lý">Đang xử lý</Option>
              <Option value="Đã hủy">Đã hủy</Option>
            </Select>
            <Button type="primary" size="small" onClick={() => handleSaveStatus(record._id)}>
              Lưu
            </Button>
            <Button size="small" onClick={() => setEditingOrderId(null)}>
              Hủy
            </Button>
          </Space>
        ) : (
          <Tag color={statusColors[status] || "default"}>
            {status}
          </Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/admin/orders/${record._id}`)}
          >
            Xem chi tiết
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditStatus(record._id, record.orderStatus)}
          >
            Sửa trạng thái
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa đơn hàng này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredOrders = orders.filter(
    (o) =>
      o._id?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderBy?.firstname?.toLowerCase().includes(search.toLowerCase()) ||
      o.orderBy?.lastname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý đơn hàng</h2>
        <Input.Search
          placeholder="Tìm kiếm theo mã đơn, tên khách..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 320 }}
          allowClear
        />
        <Button icon={<ReloadOutlined />} onClick={() => setRefresh(r => !r)}>
          Làm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            setExpandedRowKeys(expanded
              ? [...expandedRowKeys, record._id]
              : expandedRowKeys.filter(k => k !== record._id)
            );
          },
          expandedRowRender: record => (
            <div>
              <b>Chi tiết sản phẩm:</b>
              <table style={{ width: "100%", margin: "12px 0", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "1px solid #eee", textAlign: "left", padding: 4 }}>Tên sản phẩm</th>
                    <th style={{ borderBottom: "1px solid #eee", textAlign: "center", padding: 4 }}>Số lượng</th>
                    <th style={{ borderBottom: "1px solid #eee", textAlign: "right", padding: 4 }}>Đơn giá</th>
                    <th style={{ borderBottom: "1px solid #eee", textAlign: "right", padding: 4 }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                    {record.products?.map((item, idx) => (
                        <tr key={idx}>
                        <td style={{ padding: 4 }}>{item.title || "Sản phẩm"}</td>
                        <td style={{ textAlign: "center", padding: 4 }}>{item.quantity}</td>
                        <td style={{ textAlign: "right", padding: 4 }}>
                            {item.price?.toLocaleString("vi-VN") || "0"} ₫
                        </td>
                        <td style={{ textAlign: "right", padding: 4 }}>
                            {(item.price * item.quantity)?.toLocaleString("vi-VN") || "0"} ₫
                        </td>
                        </tr>
                    ))}
                    </tbody>
              </table>
              <div>
                <b>Địa chỉ giao hàng:</b> {record.shippingAddress || "Không có"}
              </div>
              <div>
                <b>Ghi chú:</b> {record.note || "Không có"}
              </div>
            </div>
          )
        }}
      />
    </div>
  );
};

export default OrderAdmin;