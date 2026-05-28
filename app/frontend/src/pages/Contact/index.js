import React, { useState } from "react";
import "../../styles/Contact.scss";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-left">
        <div className="contact-info">
          <h1>Liên Hệ</h1>
          <ul>
            <li>
              <span role="img" aria-label="address">📍</span>
              Địa chỉ: KTX Khu B, P. Linh Trung, Q. Thủ Đức, TP.HCM
            </li>
            <li>
              <span role="img" aria-label="phone">📞</span>
              Số điện thoại: 0378240260
            </li>
            <li>
              <span role="img" aria-label="mail">✉️</span>
              Email: gymflex@gmail.com
            </li>
          </ul>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>LIÊN HỆ VỚI CHÚNG TÔI</h3>
          <input
            type="text"
            name="name"
            placeholder="Họ và tên*"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="phonenumber"
            placeholder="Số điện thoại*"
            value={form.phonenumber}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Nhập nội dung*"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
          />
          <button type="submit">
            Gửi liên hệ của bạn
          </button>
          {submitted && (
            <div className="success-message" style={{ color: "green", marginTop: 16 }}>
              Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.
            </div>
          )}
        </form>
      </div>
      <div className="contact-right">
        <div className="contact-map">
          <iframe
            title="Bản đồ cửa hàng"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.0709101917423!2d106.7799263759187!3d10.882211289273025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d89aad780e49%3A0x54542761d4c22175!2zS8O9IHTDumMgeMOhIMSQSFFHLUhDTQ!5e0!3m2!1svi!2s!4v1748268675320!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: 12 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;