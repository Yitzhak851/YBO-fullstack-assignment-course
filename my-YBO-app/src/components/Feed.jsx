// my-YBO-app/src/components/Feed.jsx : This component is responsible for displaying a feed of posts. It fetches posts from the backend API and displays them in a grid layout. The component also includes a "Load More" button to fetch additional posts when clicked. The useEffect hook is used to fetch the initial set of posts when the component mounts or when the userId parameter changes.
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
    try {
      console.log("Step A");
      setLoading(true);

      const currentStart = reset ? 0 : start;
      const data = await fetchPosts(currentStart, 10, userId);

      console.log("DATA FROM SERVER:", data);

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
    console.log("Step B");
    loadPosts(true);
  }, [userId]);

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, maxWidth: 1100, mx: "auto", }} > {posts.map((post) => (<SinglePost key={post.id} post={post} />))}</Box>
      <Box sx={{ textAlign: "center", mt: 4 }}> {loading ? (<CircularProgress />) : (<Button variant="contained" onClick={() => loadPosts(false)}> Load More </Button>)} </Box>
    </Box>
  );
}

export default Feed;