import {
  Layout,
  Card,
  Button,
  Input,
  Radio,
  Row,
  Col,
  Modal,
  message,
} from "antd";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import "../Users.scss";
import {
  getCurrentUser,
  updateCurrentUser,
} from "../../../services/usersServices";
const { Content } = Layout;

function UserProfileInfo() {
  const { user, updateUser } = useOutletContext();
  const [gender, setGender] = useState("");
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.fullname || "");
      setGender(user.gender || "female");
      setNewEmail(user.email || "");
      setNewPhone(user.mobile || "");
    }
  }, [user]);

  const handleUpdate = async (updatedFields = {}) => {
    try {
      const updateData = {
        fullname: name,
        gender,
        email: newEmail,
        mobile: newPhone,
        ...updatedFields,
      };

      await updateCurrentUser(updateData);
      const freshUser = await getCurrentUser();
      updateUser(freshUser);

      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      message.error(error.message || "Cập nhật thông tin thất bại!");
    }
  };

  const handleUpdateEmail = async () => {
    await handleUpdate({ email: newEmail });
    setEmailModalOpen(false);
  };

  const handleUpdatePhone = async () => {
    await handleUpdate({ mobile: newPhone });
    setPhoneModalOpen(false);
  };

  return (
    <>
      <Layout>
        <Content className="user-profile__content">
          <Card title="Hồ Sơ Của Tôi" className="user-profile__card">
            <Row gutter={32}>
              <Col span={16}>
                <div className="user-profile__desc">
                  Quản lý thông tin hồ sơ để bảo mật tài khoản
                </div>
                <Row className="user-profile__row" align="middle">
                  <Col span={6}>Tên</Col>
                  <Col span={18}>
                    <Input
                      placeholder="Nhập tên"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="user-profile__row" align="middle">
                  <Col span={6}>Email</Col>
                  <Col span={18}>
                    {newEmail ? (
                      <>
                        {newEmail}
                        <Button
                          type="link"
                          onClick={() => setEmailModalOpen(true)}
                        >
                          Thay Đổi
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="link"
                        onClick={() => setEmailModalOpen(true)}
                      >
                        Thay Đổi
                      </Button>
                    )}
                  </Col>
                </Row>
                <Row className="user-profile__row" align="middle">
                  <Col span={6}>Số điện thoại</Col>
                  <Col span={18}>
                    {newPhone ? (
                      <>
                        {newPhone}
                        <Button
                          type="link"
                          onClick={() => setPhoneModalOpen(true)}
                        >
                          Thay Đổi
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="link"
                        onClick={() => setPhoneModalOpen(true)}
                      >
                        Thay Đổi
                      </Button>
                    )}
                  </Col>
                </Row>
                <Row className="user-profile__row" align="middle">
                  <Col span={6}>Giới tính</Col>
                  <Col span={18}>
                    <Radio.Group
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <Radio value="male">Nam</Radio>
                      <Radio value="female">Nữ</Radio>
                      <Radio value="other">Khác</Radio>
                    </Radio.Group>
                  </Col>
                </Row>
                <Button
                  type="primary"
                  className="user-profile__save-btn"
                  onClick={() => handleUpdate({})}
                >
                  Lưu
                </Button>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
      <Modal
        title="Cập nhật email"
        open={emailModalOpen}
        onCancel={() => setEmailModalOpen(false)}
        onOk={handleUpdateEmail}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập email mới"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
      </Modal>
      <Modal
        title="Cập nhật Sđt"
        open={phoneModalOpen}
        onCancel={() => setPhoneModalOpen(false)}
        onOk={handleUpdatePhone}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Input
          placeholder="Nhập sdt mới"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
        />
      </Modal>
    </>
  );
}

export default UserProfileInfo;
