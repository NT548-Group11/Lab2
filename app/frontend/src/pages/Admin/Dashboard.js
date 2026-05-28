import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Spin } from "antd";
import { UserOutlined, ShoppingCartOutlined, AppstoreOutlined } from "@ant-design/icons";
import { getBlogs } from "../../services/blogService";
import { getProductList } from "../../services/productsService";
import { getAllUsers } from "../../services/usersServices";
import { getOrders } from "../../services/orderService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState([]); // Thêm state cho revenueData

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, productsRes, ordersRes, blogsRes] = await Promise.all([
          getAllUsers(),
          getProductList(),
          getOrders(),
          getBlogs(),
        ]);
        setStats({
          users: usersRes.length,
          products: productsRes.length,
          orders: ordersRes.length,
          blogs: blogsRes.length,
        });
        console.log("ordersRes", ordersRes);
        const revenueByMonth = {};
        ordersRes.forEach(order => {
          const date = new Date(order.createdAt);
          const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
          const amount = order.totalAmount;
          if (!revenueByMonth[month]) {
            revenueByMonth[month] = 0;
          }
          revenueByMonth[month] += amount;
        });
        const chartData = Object.keys(revenueByMonth).sort().map(month => ({
          month,
          revenue: revenueByMonth[month],
        }));
        setRevenueData(chartData);
      } catch (err) {
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Row gutter={32}>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.users}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={stats.products}
              prefix={<AppstoreOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={stats.orders}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            <Statistic
              title="Tổng số bài viết"
              value={stats.blogs}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 32 }}>
        <h3>Biểu đồ doanh thu theo tháng</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {loading && (
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;