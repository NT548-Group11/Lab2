function VoucherDetail({ voucher }) {
  if (!voucher) return null;

  const isFreeShip = voucher.type === "shipping";
  const isPercentage = voucher.discountType === "percentage";

  const discountText = isPercentage
    ? `Giảm ${voucher.discountValue}%` +
      (voucher.maxDiscountAmount
        ? ` (tối đa ${voucher.maxDiscountAmount.toLocaleString()}đ)`
        : "")
    : `Giảm ${voucher.discountValue.toLocaleString()}đ`;

  return (
    <div className="voucher__detail">
      <div
        className={`voucher__icon ${
          isFreeShip ? "voucher__icon--freeship" : "voucher__icon--discount"
        }`}
      >
        {isFreeShip ? (
          <div className="voucher__detail--freeship-label">Mã vận chuyển</div>
        ) : (
          <div className="voucher__detail--discount-label">GIẢM GIÁ</div>
        )}
      </div>

      <div className="voucher__detail--info">
        <div className="voucher__detail--desc">{discountText}</div>
        <div className="voucher__detail--min">
          Đơn tối thiểu {voucher.minOrderValue?.toLocaleString()}đ
        </div>
        <div className="voucher__detail--date">
          HSD:{" "}
          {voucher.expiry
            ? new Date(voucher.expiry).toLocaleDateString("vi-VN")
            : ""}
        </div>
        <div className="voucher__detail--usage">
          {voucher.usageLimit
            ? `Còn lại: ${Math.max(
                voucher.usageLimit - voucher.usedCount,
                0
              )} lượt`
            : "Không giới hạn lượt"}
        </div>
      </div>
    </div>
  );
}

export default VoucherDetail;
