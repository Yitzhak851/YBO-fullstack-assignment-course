// my-YBO-app/src/components/Feed.jsx
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import SinglePost from "./SinglePost";
import { fetchPosts } from "../api/api";

function Feed() {
  const { userId } = useParams();

  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  async function loadPosts(reset = false) {
    try {
      setLoading(true);

      const currentStart = reset ? 0 : start;
      const data = await fetchPosts(currentStart, 10, userId);

      const newPosts = Array.isArray(data) ? data : data.posts || [];

      setPosts((prevPosts) =>
        reset ? newPosts : [...prevPosts, ...newPosts]
      );

      setStart(currentStart + 10);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts(true);
  }, [userId]);

  return (
    <Box
      sx={{
        maxWidth: viewMode === "grid" ? 1200 : 700,
        mx: "auto",
        mt: 4,
        mb: 4,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant={viewMode === "grid" ? "contained" : "outlined"}
          onClick={() => setViewMode("grid")}
        >
          Grid View
        </Button>

        <Button
          variant={viewMode === "list" ? "contained" : "outlined"}
          onClick={() => setViewMode("list")}
        >
          List View
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            viewMode === "grid"
              ? "repeat(auto-fit, minmax(320px, 1fr))"
              : "1fr",
          gap: 3,
        }}
      >
        {posts.map((post) => (
          <SinglePost key={post.id} post={post} />
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          onClick={() => loadPosts(false)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      </Box>
    </Box>
  );
}

export default Feed;