import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { getBlogs } from "../../services/blogService";
import { useNavigate } from "react-router-dom";
import "./Blog.scss";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getBlogs().then((data) => {
      setBlogs(Array.isArray(data) ? data : []);
    });
  }, []);

  return (
    <div className="blog-list-container">
      <h1>Fitness Blog</h1>
      <div className="blog-list-grid">
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            className="blog-card"
            cover={
              <img
                alt={blog.title}
                src={blog.img}
                className="blog-img"
                style={{ height: 220, objectFit: "cover" }}
              />
            }
            style={{ marginBottom: 24, cursor: "pointer" }}
            onClick={() => navigate(`/blog/${blog._id}`)}
          >
            <div className="blog-info">
              <h3>{blog.title}</h3>
              <p className="blog-desc">{blog.description}</p>
              <div className="blog-meta">
                <span>Tác giả: {blog.author || "Admin"}</span>
                <span>
                  {blog.TimeRanges
                    ? new Date(blog.TimeRanges).toLocaleDateString()
                    : ""}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Blog;