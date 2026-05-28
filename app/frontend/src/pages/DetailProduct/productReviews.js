import {
  Pagination,
  Rate,
  Button,
  Input,
  List,
  Typography,
  message,
} from "antd";
import { useState, useEffect, useCallback } from "react";
import { addReview, getReviewsByProduct } from "../../services/reviewService";
import "./ProductReview.scss";
const { TextArea } = Input;
const { Title, Text } = Typography;

function ProductReviews({ productId , onAverageRatingChange }) {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 
  const [newComment, setNewComment] = useState(""); 
  const [newRating, setNewRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 5;

  const calculateAverageRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const fetchReviews = useCallback(async () => {
    try {
      const response = await getReviewsByProduct(productId);
      if (Array.isArray(response)) {
        setReviews(response);
        const average = calculateAverageRating(response);
        if (onAverageRatingChange) {
          onAverageRatingChange(average);
        }
      } else {
        setReviews([]);
      }
    } catch (error) {
    }
  }, [productId, onAverageRatingChange]);

  const handleSubmit = async () => {
    if (newComment.trim() && newRating > 0) {
      try {
        setLoading(true);
        const response = await addReview(productId, newRating, newComment);
        if (response.message.includes("already reviewed")) {
          message.warning("Bạn đã đánh giá sản phẩm này trước đó!");
        } else {
          message.success("Đánh giá của bạn đã được gửi!");
          setNewComment("");
          setNewRating(0);
          fetchReviews();
        }
      } catch (error) {
        message.error(error.message || "Không thể gửi đánh giá!");
      } finally {
        setLoading(false);
      }
    } else {
      message.warning("Vui lòng nhập đánh giá và chọn số sao!");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const paginatedReviews = Array.isArray(reviews)
    ? reviews.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];
  return (
    <div className="product-reviews">
      <div className="add-review" style={{ marginTop: "20px" }}>
        <Title level={5}>Viết đánh giá của bạn</Title>
        <Rate
          value={newRating}
          onChange={(value) => setNewRating(value)}
          style={{ marginBottom: "10px" }}
        />
        <TextArea
          rows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nhập đánh giá của bạn..."
        />
        <Button
          type="primary"
          style={{ marginTop: "10px" }}
          onClick={handleSubmit}
          loading={loading}
        >
          Gửi đánh giá
        </Button>
      </div>

      {/* Hiển thị danh sách đánh giá */}
      <List
        itemLayout="vertical"
        dataSource={paginatedReviews}
        loading={loading}
        locale={{ emptyText: "Chưa có đánh giá nào" }}
        renderItem={(review) => (
          <List.Item>
            <Text strong>{review.user?.name || "Người dùng ẩn danh"}</Text>
            <Rate disabled value={review.rating} />
            <p>{review.comment}</p>
            <Text type="secondary">
              {new Date(review.createdAt).toLocaleDateString()}
            </Text>
          </List.Item>
        )}
      />

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={reviews.length}
        onChange={(page) => setCurrentPage(page)}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
}

export default ProductReviews;
