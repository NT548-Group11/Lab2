import React from "react";
import { Row, Col, Card } from "antd";
import { useState } from "react";
import "./Knowledge.scss";
import { NavLink } from "react-router-dom";
import bung from "../../assets/images/bung_blog.jpg";
import chan from "../../assets/images/Leg-Day-Workout.webp";
import tay from "../../assets/images/tay_blog.jpg";
import vai from "../../assets/images/vai_blog.webp";
import lung from "../../assets/images/lung_blog.webp";
import nguc from "../../assets/images/benchhead.jpg";

import schedules from "../../data/schedules";

const muscleGroups = [
  { id: "Ngực", group: "Các bài tập ngực", image: nguc },
  { id: "Lưng", group: "Các bài tập lưng", image: lung },
  { id: "Vai", group: "Các bài tập vai", image: vai },
  { id: "Tay", group: "Các bài tập tay", image: tay },
  { id: "Chân", group: "Các bài tập chân", image: chan },
  { id: "Bụng", group: "Các bài tập bụng", image: bung },
];



function Knowledge() {
  const [selectedDays, setSelectedDays] = useState(5);
  const [level, setLevel] = useState("beginner");
  return (
    <div className="blog-container">

      {/* Phần 1: Kĩ thuật tập luyện */}
      <section className="blog-section">
        <h2>Kĩ thuật tập luyện</h2>
        <Row gutter={[16, 16]}>
          {muscleGroups.map((group) => (
            <Col key={group.id} xs={24} sm={12} md={8} lg={8}>
              <NavLink to={`/knowledge/${group.id}`}>
                <Card className="exercise-card" cover={<img alt={group.group} src={group.image} />}>
                  <div className="exercise-info">
                    <h3>{group.group}</h3>
                  </div>
                </Card>
              </NavLink>
            </Col>
          ))}
        </Row>
      </section>
      {/* Phần 3: Lịch tập cá nhân hóa */}
      <section className="blog-section">
        <h2>Lịch tập cá nhân hóa</h2>
        <p>Thiết kế lịch tập phù hợp với mục tiêu và thể trạng của bạn:</p>
        <div className="schedule-level-buttons">
          <button
            className={`schedule-level-btn${level === "beginner" ? " active" : ""}`}
            onClick={() => setLevel("beginner")}
          >
            Người mới bắt đầu
          </button>
          <button
            className={`schedule-level-btn${level === "advanced" ? " active" : ""}`}
            onClick={() => setLevel("advanced")}
          >
            Đã biết tập
          </button>
        </div>
        <div className="schedule-buttons">
          {[3, 4, 5, 6].map((num) => (
            <button
              key={num}
              className={`schedule-btn${selectedDays === num ? " active" : ""}`}
              onClick={() => setSelectedDays(Number(num))} // Đảm bảo là số
            >
              {num} ngày
            </button>
          ))}
        </div>
        <ul className="schedule-list">
          {(schedules[level] && schedules[level][selectedDays]) ? (
            schedules[level][selectedDays].map((item, idx) => (
              <li key={idx}>
                <strong>{item.day}:</strong> 
                <span className="schedule-li-text">{item.content}</span>
              </li>
            ))
          ) : (
            <li>Không có dữ liệu cho lựa chọn này.</li>
          )}
        </ul>
        <p>
          Hãy đảm bảo bạn có thời gian nghỉ ngơi đủ để cơ bắp phục hồi và phát triển.
        </p>
      </section>
    </div>
  );
}

export default Knowledge;