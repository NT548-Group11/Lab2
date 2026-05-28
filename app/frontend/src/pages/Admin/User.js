import  { useEffect, useState } from "react";
import { Select } from "antd";
import { Table, Input, Button, Avatar, Space, Pagination, Modal, message, Tag } from "antd";
import { EyeOutlined, EditOutlined, StopOutlined, CheckCircleOutlined} from "@ant-design/icons";
import { getAllUsers, blockUser, unblockUser } from "../../services/usersServices"; 
import { changeUserRole } from "../../services/usersServices";
import { getOrderByIdAdmin} from "../../services/orderService";

const { Search } = Input;

const User = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRole, setEditingRole] = useState("");

    useEffect(() => {
    fetchUsers();
    }, []);

    const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res || []);
    } catch (err) {
      message.error("Không thể tải danh sách người dùng!");
    }
    setLoading(false);
    };

    // Hàm block hoặc unblock user
    const handleBlockToggle = (user) => {
    const isBlocked = user.isBlocked;
    Modal.confirm({
      title: isBlocked ? "Mở khóa người dùng" : "Khóa người dùng",
      content: isBlocked
        ? "Bạn có chắc chắn muốn mở khóa người dùng này?"
        : "Bạn có chắc chắn muốn khóa người dùng này?",
      okText: isBlocked ? "Mở khóa" : "Khóa",
      okType: isBlocked ? "primary" : "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (isBlocked) {
            await unblockUser(user._id);
            message.success("Đã mở khóa người dùng!");
          } else {
            await blockUser(user._id);
            message.success("Đã khóa người dùng!");
          }
          fetchUsers();
        } catch {
          message.error("Thao tác thất bại!");
        }
      },
    });
    };

    const handleChangeRole = async (userId, newRole) => {
      try {
        await changeUserRole(userId, newRole);
        message.success("Cập nhật vai trò thành công!");
        // Gọi lại API lấy danh sách user nếu cần
      } catch (err) {
        message.error(err.message || "Cập nhật vai trò thất bại!");
      }
    };
    const handleEditRole = (user) => {
      setEditingUserId(user._id);
      setEditingRole(user.role);
    };

    const handleSaveRole = async (userId) => {
      try {
        await changeUserRole(userId, editingRole);
        message.success("Cập nhật vai trò thành công!");
        setEditingUserId(null);
        setEditingRole("");
        fetchUsers();
      } catch (err) {
        message.error(err.message || "Cập nhật vai trò thất bại!");
      }
    };
    const handleViewUser = async (user) => {
    setSelectedUser(user);
    setViewModal(true);
    setOrderLoading(true);
    try {
      // Gọi API lấy lịch sử mua hàng, thay user._id bằng trường phù hợp
      const orders = await getOrderByIdAdmin(user._id);
      setOrderHistory(orders || []);
    } catch {
      setOrderHistory([]);
    }
    setOrderLoading(false);
    };

    const filteredUsers = users.filter(
    (u) =>
        u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.mobile?.toLowerCase().includes(search.toLowerCase())
    );

    const pagedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

    const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "Họ và têntên",
      key: "Họ và tên",
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} size={48}>
            {record.fullname?.[0]}
          </Avatar>
          <div>
            <div style={{ fontWeight: 600 }}>{record.fullname}</div>
            <div style={{ fontSize: 12, color: "#888" }}>{record.username}</div>
            {record.isBlocked && (
              <Tag color="red" style={{ marginTop: 4 }}>Blocked</Tag>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => <span>{text || "--"}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span>{text || "--"}</span>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "blue" : "green"}>
          {role === "admin" ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="text"
            onClick={() => handleViewUser(record)}
          />
          {editingUserId === record._id ? (
            <>
              <Select
                value={editingRole}
                style={{ width: 100 }}
                onChange={setEditingRole}
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "user", label: "User" },
                ]}
              />
              <Button
                type="primary"
                onClick={() => handleSaveRole(record._id)}
                style={{ marginLeft: 8 }}
              >
                Lưu
              </Button>
              <Button
                onClick={() => setEditingUserId(null)}
                style={{ marginLeft: 4 }}
              >
                Hủy
              </Button>
            </>
          ) : (
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => handleEditRole(record)}
            />
          )}
          <Button
            icon={record.isBlocked ? <CheckCircleOutlined /> : <StopOutlined />}
            type="text"
            danger={!record.isBlocked}
            style={{ color: record.isBlocked ? "#52c41a" : "#ff4d4f" }}
            onClick={() => handleBlockToggle(record)}
            title={record.isBlocked ? "Unblock" : "Block"}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: "#f8fafc", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <Search
          placeholder="Search here..."
          allowClear
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 320 }}
        />
      </div>
        <Table
            columns={columns}
            dataSource={pagedUsers}
            rowKey="_id"
            pagination={false}
            loading={loading}
            bordered={false}
            style={{ background: "#fff", borderRadius: 8 }}
        />
      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
        <span>
          Showing {pagedUsers.length} entries
        </span>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredUsers.length}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>
        <Modal
        open={viewModal}
        title="Thông tin người dùng"
        onCancel={() => setViewModal(false)}
        footer={null}
        width={700}
        >
        {selectedUser && (
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <Avatar src={selectedUser.avatar} size={64} style={{ marginRight: 16 }}>
                {selectedUser.fullname?.[0]}
              </Avatar>
              <div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{selectedUser.fullname}</div>
                <div style={{ color: "#888" }}>{selectedUser.username}</div>
                <div>Email: {selectedUser.email}</div>
                <div>Phone: {selectedUser.mobile}</div>
                <div>
                  Role:{" "}
                  <Tag color={selectedUser.role === "admin" ? "blue" : "green"}>
                    {selectedUser.role === "admin" ? "Admin" : "User"}
                  </Tag>
                </div>
                {selectedUser.isBlocked && <Tag color="red">Blocked</Tag>}
              </div>
            </div>
            <div>
              <h3>Lịch sử mua hàng</h3>
              {orderLoading ? (
                <div>Đang tải...</div>
              ) : orderHistory.length === 0 ? (
                <div>Chưa có đơn hàng nào.</div>
              ) : (
                <Table
                  dataSource={orderHistory}
                  rowKey="_id"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: "Mã đơn", dataIndex: "_id", key: "_id" },
                    { title: "Ngày mua", dataIndex: "createdAt", key: "createdAt", render: (date) => new Date(date).toLocaleString() },
                    { title: "Tổng tiền", dataIndex: "total", key: "total", render: (total) => total?.toLocaleString() + " đ" },
                    { title: "Trạng thái", dataIndex: "status", key: "status" },
                  ]}
                />
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default User;
// ...existing code...