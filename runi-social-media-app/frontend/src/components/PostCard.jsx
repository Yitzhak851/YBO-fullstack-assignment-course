import { useState } from "react";
import api from "../api/api";

function PostCard({ post, onPostUpdated }) {
  const [commentText, setCommentText] = useState("");

  const handleLike = async () => {
    await api.post(`/posts/${post.id}/like`);
    onPostUpdated();
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    await api.post(`/posts/${post.id}/comments`, {
      content: commentText
    });

    setCommentText("");
    onPostUpdated();
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <strong>{post.author.username}</strong>
        <span>{post.time_ago}</span>
      </div>

      <h3>{post.title}</h3>

      <p>{post.content}</p>

      {post.image_url && (
        <img className="post-image" src={post.image_url} alt="Post" />
      )}

      <div className="post-actions">
        <button onClick={handleLike}>❤️ {post.likes_count}</button>
        <span>{post.comments.length} comments</span>
      </div>

      <div className="comments-section">
        {post.comments.map((comment) => (
          <div key={comment.id} className="comment">
            <strong>{comment.author.username}: </strong>
            <span>{comment.content}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddComment} className="comment-form">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </article>
  );
}

export default PostCard;