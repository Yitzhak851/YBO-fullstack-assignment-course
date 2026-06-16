// my-YBO-app/src/components/SinglePost.jsx
import { useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

function SinglePost({ post }) {
  const [expanded, setExpanded] = useState(false);

  const shortText = post.body
    .split("\n")
    .slice(0, 3)
    .join("\n");

  const postImage = post.image_url;

  return (
    <Card sx={{ p: 2, minHeight: 260 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              width: 200,
              minWidth: 200,
              height: 150,
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#eeeeee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ddd",
            }}
          >
            {postImage ? (
              <Box
                component="img"
                src={postImage}
                alt={post.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", px: 2 }}
              >
                No image in this post
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                mb: 1,
                textAlign: "center",
              }}
            >
              {post.title}
            </Typography>

            <Typography
              variant="body2"
              color="primary"
              sx={{
                mb: 3,
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              user{post.userId}@example.com
            </Typography>

            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-line",
                textAlign: "center",
                flexGrow: 1,
              }}
            >
              {expanded ? post.body : shortText + "..."}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 3,
              }}
            >
              <Button
                variant="contained"
                size="small"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show Less" : "Read More"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SinglePost;