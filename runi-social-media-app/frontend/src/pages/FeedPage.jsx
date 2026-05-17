import { useEffect, useState } from "react";
import api from "../api/api";
import PostCard from "../components/PostCard";

function FeedPage() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const response = await api.get("/posts");
    setPosts(response.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section>
      <h1>Feed</h1>

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id} post={post} onPostUpdated={fetchPosts} />
        ))
      )}
    </section>
  );
}

export default FeedPage;