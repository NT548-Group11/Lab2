import { Button, Form, Input, message } from "antd";
import "./UserPassword.scss";
import { useState } from "react";
import { changePassword } from "../../../services/usersServices";

function UserPassword() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu mới và xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      await changePassword({ oldPassword, newPassword });
      message.success("Đổi mật khẩu thành công!");
    } catch (error) {
      message.error(error.message || "Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-password">
      <h2 className="user-password__title">Đổi mật khẩu</h2>
      <p className="user-password__description">
        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
      </p>

      <Form layout="vertical" className="user-password__form" onFinish={handleSubmit}>
        <Form.Item
          label="Mật khẩu cũ"
          name="oldPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu cũ" className="user-password__input" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" className="user-password__input" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
        >
          <Input.Password placeholder="Xác nhận mật khẩu mới" className="user-password__input" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          className="user-password__button"
          loading={loading}
        >
          Xác Nhận
        </Button>
      </Form>
    </div>
  );
}

export default UserPassword;