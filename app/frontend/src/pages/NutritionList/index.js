import React from "react";
import { Card } from "antd";
import { nutritionTopics } from "../../data/nutritionData";
import "../../styles/NutritionList.scss";

function NutritionList() {
  return (
    <div className="nutrition-list-container">
      <h1>Danh sách các bài viết dinh dưỡng thể hình</h1>
      <div className="nutrition-list-grid">
        {nutritionTopics.map((topic) => (
          <Card
            key={topic.id}
            className="nutrition-card"
            cover={<img alt={topic.title} src={topic.image} />}
            style={{ marginBottom: 24 }}
          >
            <div className="nutrition-info">
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default NutritionList;