// my-YBO-app/src/components/Feed.jsx - this component is responsible for fetching and displaying a list of posts.
// It uses the fetchPosts function from the API module to retrieve posts from the backend and displays them in a grid layout using the SinglePost component.

import { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import SinglePost from "./SinglePost";
import { fetchPosts } from "../api/api";

function Feed() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(0);
  const [loading, setLoading] = useState(false);

async function loadPosts(reset = false) {
  setLoading(true);
  try {
    const currentStart = reset ? 0 : start;
    const response = await fetchPosts(currentStart, 10, userId);
    console.log("Fetched posts:", response);
    const newPosts = Array.isArray(response) ? response : response.posts || [];
    setPosts((prevPosts) => reset ? newPosts : [...prevPosts, ...newPosts]);
    setStart(currentStart + 10);
  } catch (err) {
    console.error("Failed to load posts:", err);
  } finally {
    setLoading(false);
  }
}

  // useEffect hook is used to load posts when the component mounts or when the userId changes.
  useEffect(() => {
    loadPosts(true);
  }, [userId]);

  // this return renders the list of posts in a grid layout and includes a "Load More" button to fetch more posts when clicked.
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, maxWidth: 1100, mx: "auto", }} >
        {posts.map((post) => ( <SinglePost key={post.id} post={post} /> ))}
      </Box>
      <Box sx={{ textAlign: "center", mt: 4 }}>
        {/* =========================================== Load More =========================================== */}
        {loading ? ( <CircularProgress /> ) : ( <Button variant="contained" onClick={() => loadPosts(false)}> Load More </Button> )}
      </Box>
    </Box>
  );
}

export default Feed;