import { Modal, Radio, Button } from "antd";
import { useState, useEffect } from "react";
function PaymentModal({
  open,
  onClose,
  selectedPayment,
  setSelectedPayment,
}) {
  const [tempPayment, setTempPayment] = useState(selectedPayment);

  useEffect(() => {
    setTempPayment(selectedPayment);
  }, [selectedPayment, open]);

  return (
    <Modal
      open={open}
      title="Chọn phương thức thanh toán"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={() => {
            setSelectedPayment(tempPayment);
            onClose();
          }}
        >
          OK
        </Button>,
      ]}
    >
      <Radio.Group
        value={tempPayment}
        onChange={(e) => setTempPayment(e.target.value)}
        style={{ width: "100%" }}
      >
        <Radio value="COD">Thanh toán tiền mặt</Radio>
        <Radio value="Chuyển khoản">Chuyển khoản ngân hàng</Radio>
      </Radio.Group>
    </Modal>
  );
}
export default PaymentModal;
