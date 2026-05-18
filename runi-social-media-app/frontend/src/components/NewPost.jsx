import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";

function NewPost() {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ borderRadius: 4, p: 2 }}>
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            sx={{ mb: 5 }}
          >
            Create New Post
          </Typography>

          <TextField
            fullWidth
            label="Title"
            placeholder="Enter post title..."
            margin="normal"
          />

          <TextField
            fullWidth
            multiline
            rows={10}
            label="Body"
            placeholder="Write your post content here..."
            margin="normal"
          />

          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
            >
              Publish
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default NewPost;