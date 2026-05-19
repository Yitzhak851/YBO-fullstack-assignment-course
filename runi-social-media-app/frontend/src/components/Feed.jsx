// Feed.jsx - runi-social-media-app
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

// API functions
import SinglePost from "./SinglePost";
import { fetchPosts } from "../api/api.js";
import { getImages } from "../api/api.js";
import { getUsers } from "../api/api.js";

function Feed() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadPosts(reset = false) {
    setLoading(true);
    // the 2 variables that we define here are used to determine the starting point for fetching posts and to store the newly fetched posts.
    const currentStart = reset ? 0 : start;
    const newPosts = await fetchPosts(currentStart, 10, userId);
    console.log("Fetched posts:", newPosts); // Log the fetched posts for debugging
    setPosts(reset ? newPosts : [...posts, ...newPosts]);
    setStart(currentStart + 10);
    setLoading(false);
  }

  useEffect(() => {
    loadPosts(true);
  }, [userId]);

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 3,
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        {posts.map((post) => (
          <SinglePost key={post.id} post={post} />
        ))}
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" onClick={() => loadPosts(false)}>
            Load More
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Feed;