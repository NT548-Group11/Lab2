import { Row, Col, Collapse, Button, Divider, Card, Tag } from "antd";
import { useEffect, useState } from "react";
import VoucherModal from "./VoucherModal";
import CartList from "./cartList";
import "./Carts.scss";
import CartAddress from "./cartAddress";
import { getCart, clearCart } from "../../services/cartService";
import { createOrder } from "../../services/usersServices";
import { useDispatch } from "react-redux";
import { createPayOSOrder } from "../../services/paymentService"; 
import PaymentModal from "./paymentMethodModal";

const idx = 5000;
function Carts() {
  const [isVoucherModalOpen, setVoucherModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedFreeShip, setSelectedFreeShip] = useState(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const dispatch = useDispatch();
  const [cart, setCart] = useState({ products: [], CartTotal: 0 });
  const [activeKey, setActiveKey] = useState("1");
  const fetchCart = async () => {
    try {
      const response = await getCart();
      setCart(response);
      const totalQuantity = response.products.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      dispatch({ type: "SET_TOTAL_QUANTITY", payload: totalQuantity });
    } catch (error) {}
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleClearCart = async () => {
    try {
      await clearCart();
      fetchCart();
    } catch (error) {}
  };

  const items = [
    {
      key: "1",
      label: "Cart",
      children: (
        <>
          {cart && cart.length > 0 ? (
            <CartList cart={cart} refreshCart={fetchCart} />
          ) : (
            <div>Giỏ hàng trống</div>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: "Address",
      children: (
        <>
          <CartAddress />
        </>
      ),
    },
  ];


  const totalPrice = cart.CartTotal || 0;
  

  const handleOpenVoucherModal = () => {
    setVoucherModalOpen(true);
  };

  const handleCloseVoucherModal = () => {
    setVoucherModalOpen(false);
  };
  const handleOpenPaymentModal = () => {
    setPaymentModalOpen(true);
  };
  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false); 
  };
  
  const handlePlaceOrder = async () => {
  if (!selectedPayment) {
    alert("Vui lòng chọn phương thức thanh toán!");
    return;
  }
  try {
    if (selectedPayment === "Chuyển khoản") {
      const data = await createPayOSOrder("Thanh toán đơn hàng");
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(data.error || "Không lấy được link thanh toán!");
      }
    } else {
      // Đặt hàng COD như cũ
      await createOrder({
        COD: true,
        couponApplied: !!selectedVoucher || !!selectedFreeShip,
      });
      fetchCart();
      alert("Đặt hàng thành công!");
    }
  } catch (error) {
    alert("Đặt hàng thất bại!");
  }
};
  
  const calculateDiscount = (voucher, totalPrice) => {
    if (!voucher) return 0;

    if (voucher.discountType === "fixed") {
      return Math.min(
        voucher.discountValue,
        voucher.maxDiscountAmount || voucher.discountValue,
        totalPrice
      );
    } else if (voucher.discountType === "percentage") {
      const discount = (totalPrice * voucher.discountValue) / 100;
      return Math.min(discount, voucher.maxDiscountAmount || discount);
    }

    return 0;
  };

  const totalVoucherDiscount =
    calculateDiscount(selectedVoucher, totalPrice) +
    calculateDiscount(selectedFreeShip, idx);

  return (
    <>
      <Row gutter={[16, 16]} className="cart__container">
        <Col span={16}>
          <Collapse
            items={[
              {
                key: "1",
                label: "Cart",
                children: (
                  <>
                    {cart.products && cart.products.length > 0 ? (
                      <CartList cart={cart.products} refreshCart={fetchCart} />
                    ) : (
                      <div>Giỏ hàng trống</div>
                    )}
                  </>
                ),
              },
              {
                key: "2",
                label: "Address",
                children: (
                  <>
                    <CartAddress />
                  </>
                ),
              },
            ]}
            defaultActiveKey={["1"]}
            onChange={setActiveKey}
            activeKey={activeKey}
          />
        </Col>
        <Col span={8}>
          <Card className="cart__summary">
            <h3 className="cart__summary--title">ORDER SUMMARY</h3>
            <Divider />
            <div className="cart__summary--item">
              <span>Tổng số tiền</span>
              <span>{totalPrice.toLocaleString()}</span>
            </div>
            <div className="cart__summary--item">
              <span>Tiền vận chuyển:</span>
              <span>{idx.toLocaleString(idx)}</span>
            </div>
            <div className="cart__summary--item">
              <span>Voucher</span>
              <span
                className="cart__summary--coupon"
                onClick={handleOpenVoucherModal}
              >
                {selectedVoucher || selectedFreeShip ? (
                  <>
                    {selectedVoucher && (
                      <Tag color="green">
                        {calculateDiscount(
                          selectedVoucher,
                          totalPrice
                        ).toLocaleString()}{" "}
                        VND
                      </Tag>
                    )}
                    {selectedFreeShip && (
                      <Tag color="blue">
                        {calculateDiscount(
                          selectedFreeShip,
                          idx
                        ).toLocaleString()}{" "}
                        VND
                      </Tag>
                    )}
                  </>
                ) : (
                  "Chọn Voucher"
                )}
              </span>
            </div>

            <Divider />
            {/* Tổng tiền */}
            <div className="cart__summary--item">
              <span>Tổng tiền</span>
              <span>{(totalPrice + idx).toLocaleString()}</span>
            </div>

            {/* Tổng voucher giảm giá */}
            {(selectedFreeShip || selectedVoucher) && (
              <div className="cart__summary--item">
                <span>Tổng voucher giảm giá</span>
                <span className="cart__summary--discount">{`-${totalVoucherDiscount.toLocaleString()}`}</span>
              </div>
            )}
            {/* Phương thức thanh toán */}
            <div
              className="cart__summary--item"
              onClick={handleOpenPaymentModal}
            >
              <span>Phương thức thanh toán</span>
              <span className="cart__summary--coupon">
                {selectedPayment ? selectedPayment : "Chọn"}
              </span>
            </div>
            {/* Thanh Toán */}
            <div className="cart__summary--item cart__summary--total">
              <span>Tổng thanh toán:</span>
              <span>
                {(totalPrice + idx - totalVoucherDiscount).toLocaleString()}
              </span>
            </div>

            <Button
              type="primary"
              block
              className="cart__summary--button"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
          </Card>
        </Col>
      </Row>
      <VoucherModal
        open={isVoucherModalOpen}
        onClose={handleCloseVoucherModal}
        totalPrice={totalPrice}
        selectedVoucher={selectedVoucher}
        setSelectedVoucher={setSelectedVoucher}
        selectedFreeShip={selectedFreeShip}
        setSelectedFreeShip={setSelectedFreeShip}
      />
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        selectedPayment={selectedPayment}
        setSelectedPayment={setSelectedPayment}
      />
    </>
  );
}
export default Carts;