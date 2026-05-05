import { useEffect, useState } from "react";
import { Box, Grid, Button, CircularProgress } from "@mui/material";
import { fetchPosts } from "../api/api";
import SinglePost from "./SinglePost";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    try {
      setLoading(true);

      const newPosts = await fetchPosts(start, 10);

      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setStart((prevStart) => prevStart + 10);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={6} key={post.id}>
            <SinglePost post={post} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Button variant="contained" onClick={loadPosts}>
            Load More
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Feed;