import { Card, Typography, Row, Col, Button, Modal } from "antd";
import { useOutletContext } from "react-router-dom";
import "./useraddress.scss";
import CartAddress from "../../Carts/cartAddress";
import { useState } from "react";
const { Text } = Typography;
function UserAddress() {
  const {user}=useOutletContext();
  const [addresses, setAddresses] = useState(user?.address || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
 

  const handleUpdateClick = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = async () => {
    setIsModalVisible(false);
  };
  return (
        <div className="user-address">
      <div className="user-address-header">
        <h2>Địa chỉ của tôi</h2>
      </div>
      <div className="user-address-list">
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <Card key={index} className="user-address-card">
              <Row>
                <Col span={18}>
                  <Text className="user-address-name">{user.fullname}</Text>
                  <div className="user-address-phone"> {user.phone}</div>
                  <div className="user-address-location">{address.detail_address}</div>
                  <div className="user-address-details">{address.address}</div>
                </Col>
                <Col span={6} className="user-address-actions">
                  <Button onClick={()=> handleUpdateClick()} type="link">Cập nhật</Button>
                </Col>
              </Row>
            </Card>
          ))
        ) : (
          <Button type="link" onClick={handleUpdateClick}>Thêm địa chỉ</Button>
        )}
        <Modal
          title="Cập nhật địa chỉ"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <CartAddress closeModal={handleModalClose} />
        </Modal>
      </div>
    </div>
  );
}
export default UserAddress;
