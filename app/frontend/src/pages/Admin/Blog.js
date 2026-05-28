import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Space, Input, Popconfirm, message } from "antd";
import { getBlogs, deleteBlog } from "../../services/blogService";
import { ReloadOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const BlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      try {
        const res = await getBlogs();
        setBlogs(Array.isArray(res) ? res : res.blogs || []);
      } catch (err) {
        message.error("Không thể tải danh sách blog!");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      message.success("Đã xóa bài viết");
      setRefresh(r => !r);
    } catch {
      message.error("Xóa bài viết thất bại!");
    }
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Button type="link" onClick={() => navigate(`/blog/${record._id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      render: (author) => author || "Admin",
    },
    {
      title: "Ngày đăng",
      dataIndex: "TimeRanges",
      key: "TimeRanges",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/blog/${record._id}`)}
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(`/admin/blogs/edit/${record._id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa bài viết này?"
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

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Quản lý Blog</h2>
        <Input.Search
          placeholder="Tìm kiếm theo tiêu đề, tác giả..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 320 }}
          allowClear
        />
        <Button type="primary" onClick={() => navigate("/admin/blogs/add")}>
          Thêm bài viết mới
        </Button>
        <Button icon={<ReloadOutlined />} onClick={() => setRefresh(r => !r)}>
          Làm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredBlogs}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default BlogAdmin;