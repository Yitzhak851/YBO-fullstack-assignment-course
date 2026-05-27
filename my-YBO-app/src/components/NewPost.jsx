import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { createPost } from "../api/api";

// Component for creating a new post
function NewPost() {
  // Initialize state and hooks
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!currentUser) {
      setError("You must be logged in to create a post");
      return;
    }
    if (!title.trim() || !body.trim()) {
      setError("Title and body are required");
      return;
    }
    try {
      await createPost({
        userId: currentUser.id,
        title,
        body,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }
  // Render the form for creating a new post
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" align="center" sx={{ mb: 5 }}> Create New Post </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Title" placeholder="Enter post title..." margin="normal" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <TextField fullWidth multiline rows={10} label="Body" placeholder="Write your post content here..." margin="normal" value={body} onChange={(e) => setBody(e.target.value)}/>
            {error && (<Typography color="error" sx={{ mt: 2 }}> {error} </Typography>)}
            <Box sx={{ mt: 4 }}>
              <Button fullWidth variant="contained" size="large" type="submit"> Publish </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default NewPost;