function PostCard({ post }) {
  return (
    <article style={{
      border: "1px solid #ddd",
      borderRadius: "12px",
      marginBottom: "24px",
      background: "white",
      overflow: "hidden"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px" }}>
        <img src={post.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
        <strong>{post.username}</strong>
      </div>

      <img
        src={post.image}
        alt={post.title}
        style={{ width: "100%", height: "500px", objectFit: "cover" }}
      />

      <div style={{ padding: "12px" }}>
        <p>❤️ {post.likes} likes</p>
        <p><strong>{post.username}</strong> {post.caption}</p>
      </div>
    </article>
  );
}

export default PostCard;