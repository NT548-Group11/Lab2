import { NavLink, useNavigate } from "react-router-dom";
import { login, register } from "../../services/usersServices";
import { Row, Col, Button, Form, Input, notification } from "antd";
import { checkLogin } from "../../actions/login";
import { useDispatch } from "react-redux";
import "../../styles/SignUp.scss";
function Register() {
  const dispatch=useDispatch();
  const navigate = useNavigate();

  const onFinish = async (e) => {
    try {
      const username = e.username;
      const password = e.password;
      const email = e.email;
      const options = {
        username: username,
        password: password,
        email: email,
      };
      const response = await register(options);
      const loginRes=await login(username,password);
      if (loginRes) {
        notification.success({
          message: "Register successful",
          description: "Welcome!",
          className: "custom-notification__success",
          placement: "topRight",
          duration: 1,
      });
      
      setTimeout(()=>{
        dispatch(checkLogin(true));
        navigate("/");
      },1000);
      
      }
    } catch (error) {
      notification.error({
        message: "Register failed",
        description: error.message,
        className: "custom-notification__error",
        placement: "topRight",
        duration: 2,
      });
    }
  };
  return (
    <>
      <div className="signup">
        <div className="signup-container">
          <Row gutter={[20, 30]}>
            <Col span={12} className="signup-header">
              <h1>Sẵn sàng cho một cơ thể khỏe mạnh? </h1>
              <p> Tạo tài khoản để truy cập giáo án tập luyện, video hướng dẫn, và kết nối với những người có cùng mục tiêu thể hình.</p>
            </Col>
            <Col span={12} className="signup-form">
              <h1>Đăng kí </h1>
              <Form name="basic" onFinish={onFinish} >
                <Form.Item
                  label="User"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Pass"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                
                <Form.Item className="signup-form__button">
                  <Button type="primary" htmlType="submit" className="button">
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
              <div> Already have an account? <NavLink to='/login'><b>Sign In</b></NavLink></div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default Register;
