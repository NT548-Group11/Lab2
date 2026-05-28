import { Dropdown } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import "./User1.scss";
function User1({ role }) {
  const items = [
    {
      key: "1",
      label: (
        <NavLink className="NavLink" to="/user/profile">
          Thông tin cá nhân
        </NavLink>
      ),
    },
    // Chỉ hiển thị nếu là admin
    ...(role === "admin"
      ? [
          {
            key: "2",
            label: (
              <NavLink className="NavLink" to="/admin">
                Quản lí
              </NavLink>
            ),
          },
        ]
      : []),
    {
      key: "3",
      label: (
        <NavLink className="NavLink" to="/logout">
          Đăng xuất
        </NavLink>
      ),
    },
  ];
  return (
    <>
      <Dropdown className="Icon" menu={{ items }} placement="bottom" arrow>
        <FontAwesomeIcon className="Icon__user" icon={faCircleUser} style={{ fontSize: "25px" }} />
      </Dropdown>
    </>
  );
}
export default User1;