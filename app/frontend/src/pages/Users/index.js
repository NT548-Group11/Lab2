import { Layout, Menu, Avatar } from "antd";
import {
  UserOutlined,
  LockOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "./Users.scss";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser} from "../../services/usersServices";
const { Sider,Content } = Layout;

function UserProfile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  
  const handleMenuClick = ({ key }) => {
    if (key === "profile") navigate("/user/profile");
    else if (key === "address") navigate("/user/address");
    else if (key === "password") navigate("/user/password");
    else if (key === "orders") navigate("/user/orders");
    else if (key === "voucher") navigate("/user/voucher");
  };
  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();
      setUser(res);
    };
    fetchUser();
  }, []);
  return (
    <Layout className="user-profile">
      <Sider width={260} className="user-profile__sider">
        <div className="user-profile__avatar-box">
          <Avatar
            size={64}
            src={user.avatar}
            icon={!user.avatar && <UserOutlined />}
          />
          <div className="user-profile__username">{user.username}</div>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["profile"]}
          className="user-profile__menu"
          items={[
            { key: "profile", icon: <UserOutlined />, label: "Hồ Sơ" },
            { key: "address", icon: <HomeOutlined />, label: "Địa Chỉ" },
            { key: "password", icon: <LockOutlined />, label: "Đổi Mật Khẩu" },
            { key: "orders", icon: <ShoppingCartOutlined />, label: "Đơn Mua" },
          ]}
          onClick={handleMenuClick}
        />
      </Sider>
      <Content className="user-profile__content">
        <Outlet context={{ user, updateUser }} key={user.updatedAt || user.email || user.fullname || Date.now()} />
      </Content>
    </Layout>
  );
}
export default UserProfile;
