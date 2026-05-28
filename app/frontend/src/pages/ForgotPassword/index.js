import { Form, Input, Button, notification } from "antd";
import { sendForgotPasswordEmail } from "../../services/usersServices"; // API gửi email
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";
function ForgotPassword() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await sendForgotPasswordEmail(values.email);
      notification.success({
        message: "Email Sent",
        description: "Please check your email for the reset link.",
        placement: "topRight",
        duration: 2,
      });
      navigate("/login");
    } catch (error) {
      notification.error({
        message: "Failed to send email",
        description: "Please try again later.",
        placement: "topRight",
        duration: 2,
      });
    }
  };

  return (
    <div className="forgot-password">
      <h1>Forgot Password</h1>
      <Form name="forgot-password" onFinish={onFinish} >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="...@gmail.com" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ForgotPassword;