import React from "react";
import "../../styles/About.scss";
import aboutImg1 from "../../assets/images/about_img(1).jpg";
import aboutImg2 from "../../assets/images/about_img(2).jpg";

function About() {
  return (
    <div className="about-main">
      {/* Dòng 1: About Us + Ảnh */}
      <div className="about-row">
        <div className="about-col">
          <div className="about-title">🏪 About Us – Về GYMFLEX</div>
          <h3>Sứ mệnh của chúng tôi</h3>
          <div className="about-desc">
            Tại GYMFLEX, chúng tôi tin rằng sức khỏe là nền tảng cho một cuộc sống chất lượng. Được thành lập bởi những người đam mê thể hình, mục tiêu của chúng tôi là mang đến cho bạn những sản phẩm tập luyện chất lượng nhất để hỗ trợ hành trình rèn luyện thể chất, xây dựng vóc dáng và phong cách sống tích cực.
          </div>
          <h3 style={{marginTop: 24}}>Chúng tôi cung cấp gì?</h3>
          <ul className="about-list">
            <li>🏋️ <b>Dụng cụ tập luyện:</b> Từ tạ tay, dây kháng lực đến ghế tập và các thiết bị tại nhà – tất cả được chọn lọc kỹ lưỡng để đảm bảo an toàn và hiệu quả.</li>
            <li>👕 <b>Trang phục thể thao:</b> Quần áo tập gym, yoga, chạy bộ với thiết kế thoải mái, thấm hút mồ hôi và phong cách thời thượng.</li>
            <li>🍽️ <b>Thực phẩm chức năng:</b> Whey protein, BCAA, creatine, vitamin và nhiều sản phẩm hỗ trợ khác từ các thương hiệu uy tín.</li>
            <li>🛠️ <b>Phụ kiện hỗ trợ:</b> Bao tay, đai lưng, bình nước, túi thể thao, giúp bạn hoàn thiện trải nghiệm tập luyện.</li>
          </ul>
        </div>
        <div className="about-col">
          <img src={aboutImg1} alt="FITPOWER Banner" />
        </div>
      </div>

      {/* Dòng 2: Ảnh + Why Choose Us */}
      <div className="about-row">
        <div className="about-col">
          <img src={aboutImg2} alt="FITPOWER Product" />
        </div>
        <div className="about-col">
          <div className="about-title">💡 Why Choose Us – Tại sao chọn GYMFLEX?</div>
          <ul className="about-list">
            <li>✅ <b>Chất lượng chính hãng:</b> Chúng tôi chỉ phân phối sản phẩm có nguồn gốc rõ ràng, kiểm định kỹ lưỡng và đến từ những thương hiệu hàng đầu trong ngành thể hình.</li>
            <li>🚚 <b>Giao hàng nhanh chóng:</b> Hệ thống giao hàng toàn quốc giúp bạn nhận sản phẩm nhanh chóng, đóng gói cẩn thận, hỗ trợ đổi trả khi cần.</li>
            <li>🎓 <b>Tư vấn chuyên sâu:</b> Đội ngũ hỗ trợ là người có kinh nghiệm thực tế về fitness, luôn sẵn sàng đưa ra lộ trình luyện tập, dinh dưỡng phù hợp với từng mục tiêu.</li>
            <li>❤️ <b>Đồng hành cùng bạn:</b> Chúng tôi không chỉ bán hàng – chúng tôi cùng bạn xây dựng lối sống lành mạnh và tự tin hơn mỗi ngày.</li>
          </ul>
        </div>
      </div>

      {/* Cộng đồng */}
      <div className="about-row">
        <div className="about-col" style={{flex: 1}}>
          <h3>📍 Tham gia cộng đồng #GYMFLEX</h3>
          <p>
            Theo dõi chúng tôi trên mạng xã hội để nhận bài tập, kế hoạch dinh dưỡng và ưu đãi hấp dẫn.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;