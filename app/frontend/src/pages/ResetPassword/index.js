import { Button, Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../services/usersServices";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
       await resetPassword(token, values.newPassword);
      message.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      message.error("Token không hợp lệ hoặc đã hết hạn!");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Đặt lại mật khẩu</h2>
      <Form onFinish={onFinish}>
        <Form.Item
          name="newPassword"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password placeholder="Mật khẩu mới" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Xác nhận
        </Button>
      </Form>
    </div>
  );
}

export default ResetPassword;