import { Modal, Button, Row, Col, Divider, Input, Radio, Tooltip } from "antd";
import { useEffect, useState } from "react";

import "./Carts.scss";
import VoucherDetail from "./VoucherDetail";
import { getVouchers } from "../../services/voucherService";
import { userCoupon } from "../../services/usersServices"; // Thêm dòng này


function VoucherModal({
  open,
  onClose,
  totalPrice,
  selectedVoucher,
  setSelectedVoucher,
  selectedFreeShip,
  setSelectedFreeShip,
}) {
  const [vouchers, setVouchers] = useState([]);
  const [search, setSearch] = useState("");
  const [tempSelectedVoucher, setTempSelectedVoucher] =
    useState(selectedVoucher);
  const [tempSelectedFreeShip, setTempSelectedFreeShip] =
    useState(selectedFreeShip);

  useEffect(() => {
    const fetchVouchers = async () => {
      const data = await getVouchers();
      // console.log("Fetched vouchers:", data);
      setVouchers(data);
    };
    fetchVouchers();
  }, []);

  const isVoucherValid = (voucher) => {
    const notExpired = new Date(voucher.expiry) > new Date();
    const minOrderOk = totalPrice >= voucher.minOrderValue;
    const usageOk =
      voucher.usageLimit === null || voucher.usedCount < voucher.usageLimit;
    return notExpired && minOrderOk && usageOk;
  };

  const filteredVouchers = vouchers.filter(
    (v) => !search || v.name.toLowerCase().includes(search.toLowerCase())
  );

  const freeShipVouchers = filteredVouchers.filter(
    (v) => v.type === "shipping"
  );
  const discountVouchers = filteredVouchers.filter((v) => v.type === "product");

  const handleSelectFreeShip = (voucher) => {
    console.log("Selected Free Ship Voucher:", voucher);
    console.log(isVoucherValid(voucher));
    if (isVoucherValid(voucher)) {
      setTempSelectedFreeShip(
        tempSelectedFreeShip?._id === voucher._id ? null : voucher
      );
    }
  };

  const handleSelectDiscount = (voucher) => {
    console.log("Selected ditcount Voucher:", voucher);
    if (isVoucherValid(voucher)) {
      setTempSelectedVoucher(
        tempSelectedVoucher?._id === voucher._id ? null : voucher
      );
    }
  };

  return (
    <Modal
      title={<span className="voucher__modal-title">Chọn Voucher</span>}
      className="voucher__modal"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Trở lại
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={async () => {
            try {
              // Gọi userCoupon với cả hai loại voucher nếu có
              await userCoupon({
                coupon: tempSelectedVoucher?.name || null,
                freeship: tempSelectedFreeShip?.name || null,
              });
            } catch (error) {
              // Có thể hiện thông báo lỗi nếu cần
            }
            setSelectedVoucher(tempSelectedVoucher);
            setSelectedFreeShip(tempSelectedFreeShip);
            onClose();
          }}
        >
          OK
        </Button>,
      ]}
    >
      <Row>
        <Col span={24} className="voucher__search">
          <div className="voucher__title">Mã Voucher</div>
          <Input
            className="voucher__input"
            placeholder="Mã Voucher"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Divider />

      <div className="voucher__title">Mã miễn phí vận chuyển</div>
      <div className="voucher__list voucher__list--freeship">
        {freeShipVouchers.map((v) => {
          const valid = isVoucherValid(v);
          const isSelected = tempSelectedFreeShip?._id === v._id;

          return (
            <Tooltip
              key={v.code}
              title={!valid ? "Không đủ điều kiện áp dụng" : ""}
            >
              <div
                onClick={() => handleSelectFreeShip(v)}
                style={{ cursor: valid ? "pointer" : "not-allowed" }}
              >
                <Radio
                  checked={isSelected}
                  disabled={!valid}
                  onChange={() => {}}
                >
                  <VoucherDetail voucher={v} />
                </Radio>
              </div>
            </Tooltip>
          );
        })}
      </div>

      <Divider />

      <div className="voucher__title">Giảm giá</div>
      <div className="voucher__list voucher__list--discount">
        {discountVouchers.map((v) => {
          const valid = isVoucherValid(v);
          const isSelected = tempSelectedVoucher?._id === v._id;
          
          return (
            <Tooltip
              key={v._id} 
              title={!valid ? "Không đủ điều kiện áp dụng" : ""}
            >
              <div 
                onClick={() => handleSelectDiscount(v)}
              >
                <Radio 
                  checked={isSelected}
                  disabled={!valid}
                  onChange={() => {}}
                >
                  <VoucherDetail voucher={v} />
                </Radio>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </Modal>
  );
}

export default VoucherModal;
