import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../../services/blogService";
import "./Blog.scss";

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    getBlogById(id).then((data) => {
      setBlog(data);
    });
  }, [id]);

  if (!blog) {
    return <div className="blog-detail-container">Đang tải...</div>;
  }

  return (
    <div className="blog-detail-container" style={{ maxWidth: 800, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", padding: 32 }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>{blog.title}</h1>
      <div className="blog-detail-meta" style={{ display: "flex", justifyContent: "space-between", color: "#888", marginBottom: 24 }}>
        <span>Tác giả: {blog.author || "Admin"}</span>
        <span>
          {blog.TimeRanges
            ? new Date(blog.TimeRanges).toLocaleDateString()
            : ""}
        </span>
      </div>
      <img
        src={blog.img}
        alt={blog.title}
        style={{ width: "100%", maxHeight: 350, objectFit: "cover", borderRadius: 8, marginBottom: 24 }}
      />
      <div className="blog-detail-desc" style={{ fontSize: 18, marginBottom: 24, color: "#444" }}>
        {blog.description}
      </div>
      <div
        className="blog-detail-content"
        style={{ fontSize: 17, color: "#222", lineHeight: 1.7 }}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}

export default BlogDetail;