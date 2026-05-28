import { Row, Col } from "antd";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import "../../styles/LayoutDefault.scss";
import logo from "../../assets/images/5c4638a6-fafb-4220-9e1a-3d7e8c642166.png";
import Cart1 from "../../features/cart";
import User1 from "../../features/user";
import { useEffect, useRef, useState } from "react";

import {
  TwitterOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getCurrentUser, refreshToken } from "../../services/usersServices";
import { checkLogin } from "../../actions/login";
import { useDispatch } from "react-redux";
import { getCart } from "../../services/cartService";
import { setCart } from "../../actions/cart";


const footerData = {
  contact: {
    title: "GYMFLEX",
    items: [
      "KTX Khu B, Thủ Đức, TP. Hồ Chí Minh",
      "+84 123 456 789",
      "gymflex@gmail.com",
    ],
    socials: [
      {
        icon: <TwitterOutlined />,
        link: "https://www.facebook.com/tri.minh.568702",
      },
      {
        icon: <FacebookOutlined />,
        link: "https://www.facebook.com/tri.minh.568702",
      },
      {
        icon: <InstagramOutlined />,
        link: "https://www.facebook.com/tri.minh.568702",
      },
      {
        icon: <YoutubeOutlined />,
        link: "https://www.facebook.com/tri.minh.568702",
      },
    ],
  },
  categories: [
    "Quần áo",
    "Thực phẩm bổ sung",
    "Dụng cụ thể thao",
    "Đồ lót",
  ],
  customerService: [
    "Chính sách bảo mật",
    "Điều khoản dịch vụ",
    "Hướng dẫn mua hàng",
    "Liên hệ hỗ trợ",
  ],
};

function LayoutDefault({ onlyHeader = false }) {
  const islogin = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const [user,setUser]=useState(null);
  const location = useLocation();
  const menuRef = useRef(null);
  const hideFooter =
    location.pathname === "/login" || location.pathname === "/register";
  useEffect(() => {
    const autoLogin = async () => {
      const accessToken = getCookie("accessToken");
      if (!accessToken) {
        const refreshed = await refreshToken();
        if (refreshed) {
          dispatch(checkLogin(true));
        } else {
          dispatch(checkLogin(false));
        }
      } else {
        dispatch(checkLogin(true));
      }
    };
    autoLogin();
  }, [dispatch]);

  useEffect(() => {
    const fetchUserCart = async () => {
      if (islogin) {
        try {
          const response = await getCart();
          dispatch(setCart(response));
        } catch (err) {
          console.error("Không lấy được giỏ hàng:", err.message);
        }
      }
    };
    fetchUserCart();
  }, [islogin, dispatch]);
  useEffect(() => {
    const fetchUser = async () => {
      if (islogin) {
        try {
          const response = await getCurrentUser();
          setUser(response);
        } catch (err) {
          console.error("Không lấy được thông tin người dùng:", err.message);
        }
      }
    };
    fetchUser();
  }, [islogin, dispatch]);

  return (
    <div>
      <header className="layout-default">
        <NavLink className="layout-default__logo" to="/">
          <div className="layout-default__logo">
            <img className="img" src={logo} alt="logo" />
            <div>GymFlex</div>
          </div>
        </NavLink>

        <div
          className={`layout-default__menu`}
          ref={menuRef}
        >
          <NavLink className="NavLink" to="/">
            Trang chủ
          </NavLink>
          {islogin ? (
            <>
              <NavLink className="NavLink" to="/products">
                Sản phẩm
              </NavLink>
              <NavLink className="NavLink" to="/blog">
                Blog
              </NavLink>
            </>
          ) : (
            <>
              <NavLink className="NavLink" to="/login">
                Sản phẩm
              </NavLink>
              <NavLink className="NavLink" to="/blog">
                Blog
              </NavLink>
            </>
          )}

          <NavLink className="NavLink" to="/knowledge">
            Kiến thức
          </NavLink>
          <NavLink className="NavLink" to="/about">
            Giới thiệu
          </NavLink>
          <NavLink className="NavLink" to="/contact">
            Liên hệ
          </NavLink>
        </div>
        <div className="layout-default__account">
          {islogin ? (
            <>
              <Cart1 />
              <User1 role={user?.role} />
            </>
          ) : (
            <>
              <NavLink className="NavLink" to="/login">
                Đăng nhập
              </NavLink>
              <NavLink className="NavLink" to="/register">
                Đăng kí
              </NavLink>
            </>
          )}
        </div>
      </header>
      <main style={{ minHeight: "60vh" }}>
        <Outlet />
      </main>
        {!onlyHeader && !hideFooter && (
        <footer className="ava-footer gymbe-footer">
          <div className="container">
            <Row gutter={[32, 32]} className="footer-content">
              {/* Contact & Social */}
              <Col xs={24} sm={12} md={8} lg={7}>
                <div className="footer-section">
                  <h3 className="footer-logo">{footerData.contact.title}</h3>
                  <div className="contact-info">
                    <p>{footerData.contact.items[0]}</p>
                    <p>{footerData.contact.items[1]}</p>
                    <p>{footerData.contact.items[2]}</p>
                  </div>
                  <div className="footer-socials">
                    {footerData.contact.socials.map((s, idx) => (
                      <a key={idx} href={s.link} target="_blank" rel="noopener noreferrer">
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </Col>
              {/* Hot Categories */}
              <Col xs={24} sm={12} md={6} lg={5}>
                <div className="footer-section">
                  <h4>Sản Phẩm</h4>
                  <ul>
                    {footerData.categories.map((item, i) => (
                      <li key={i}>
                        <a href="https://www.facebook.com/">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              {/* Customer Service */}
              <Col xs={24} sm={12} md={6} lg={6}>
                <div className="footer-section">
                  <h4>Hỗ trợ khách hàng</h4>
                  <ul>
                    {footerData.customerService.map((item, i) => (
                      <li key={i}>
                        <a href="https://www.facebook.com/">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
              {/* Newsletter */}
              <Col xs={24} sm={12} md={8} lg={6}>
                <div className="footer-section">
                  <h4>Đăng Ký Nhận Tin</h4>
                  <form className="footer-newsletter">
                    <input type="email" placeholder="Enter your email..." />
                    <button type="submit">Đăng Ký</button>
                  </form>
                </div>
              </Col>
            </Row>
          </div>
        </footer>
      )}
    </div>
  );
}

export default LayoutDefault;