import {  Button, Cascader, Col, Form, Input, message, Row, Space} from "antd";
import { useEffect, useState } from "react";
import { getAddressList } from "../../services/cartService";
import {  getCurrentUser, updateUserAddress } from "../../services/usersServices";

function CartAddress() {
  const [form] = Form.useForm();
  const [addressList, setAddressList] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const user = await getCurrentUser();
      setUserData(user);
      const addresses = await getAddressList();

      const formattedAddresses = addresses.address.map((province) => ({
        value: province.level1_id,
        label: province.name,
        children: province.level2s.map((district) => ({
          value: district.level2_id,
          label: district.name,
          children: district.level3s.map((ward) => ({
            value: ward.level3_id,
            label: ward.name,
          })),
        })),
      }));
      setAddressList(formattedAddresses);

      const selectedAddress = user.address?.[0]?.address?.split(", ") || [];

      const addressValues = selectedAddress.map((item, index) => {
        if (index === 0) {
          const province = formattedAddresses.find((p) => p.label === item);
          return province?.value || null;
        } else if (index === 1) {
          const province = formattedAddresses.find((p) =>
            selectedAddress[0]?.includes(p.label)
          );
          const district = province?.children.find((d) => d.label === item);
          return district?.value || null;
        } else if (index === 2) {
          const province = formattedAddresses.find((p) =>
            selectedAddress[0]?.includes(p.label)
          );
          const district = province?.children.find((d) =>
            selectedAddress[1]?.includes(d.label)
          );
          const ward = district?.children.find((w) => w.label === item);
          return ward?.value || null;
        }
        return null;
      });

      form.setFieldsValue({
        username: user.fullname || "",
        phone: user.mobile || "",
        address: addressValues.filter((v) => v !== null),
        detail_address: user.address?.[0]?.detail_address || "",
      });
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    }
  };

  fetchData();
}, [form]);

  const handleSubmitForm = async (values) => {
    try {
      const selectedLabels = values.address.map((value, index) => {
        const level =
          index === 0
            ? addressList.find((item) => item.value === value)
            : index === 1
            ? addressList
                .find((item) => item.value === values.address[0])
                ?.children.find((item) => item.value === value)
            : addressList
                .find((item) => item.value === values.address[0])
                ?.children.find((item) => item.value === values.address[1])
                ?.children.find((item) => item.value === value);

        return level?.label || value;
      });

      const payload = {
        fullname: values.username,
        phone: values.phone, 
        address: {
          address: selectedLabels.join(", "), 
          detail_address: values.detail_address, 
        },
      };

      console.log("Payload:", payload);

      const response = await updateUserAddress(payload);
      if (
        response &&
        response.message === "User address updated successfully"
      ) {
        message.success("Địa chỉ đã được lưu thành công!");
      }
    } catch (error) {}
  };
  return (
    <>
      <Form form={form} name="complex-form" onFinish={handleSubmitForm}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Tên người nhận"
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên người nhận" },
              ]}
            >
              <Input placeholder="Tên người nhận" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng chọn địa chỉ" }]}
        >
          <Cascader
            options={addressList}
            placeholder="Chọn Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
            expandTrigger="hover"
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ cụ thể"
          name="detail_address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể" }]}
        >
          <Input placeholder="Địa chỉ cụ thể" />
        </Form.Item>

        <Space className="button_cartaddress">
          <Button type="primary" htmlType="submit">
            Hoàn thành
          </Button>
        </Space>
      </Form>
    </>
  );
}

export default CartAddress;
