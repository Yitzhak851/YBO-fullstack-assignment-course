// my-YBO-app/src/components/SinglePost.jsx

import { useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

function timeAgo(dateString) {
  if (!dateString) return "";

  const postDate = new Date(dateString);
  const now = new Date();

  const diffMs = now - postDate;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "הרגע";
  if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;

  if (diffHours < 24) {
    const minutes = diffMinutes % 60;

    if (minutes === 0) {
      return `לפני ${diffHours} שעות`;
    }

    return `לפני ${diffHours} שעות ו-${minutes} דקות`;
  }

  if (diffDays === 1) return "לפני יום אחד";

  return `לפני ${diffDays} ימים`;
}

function SinglePost({ post, viewMode = "list" }) {
  const [expanded, setExpanded] = useState(false);

  const shortText = post.body
    .split("\n")
    .slice(0, 3)
    .join("\n");

  const fallbackImage = `https://picsum.photos/600/400?random=${post.id}`;
  const postImage = post.image_url || fallbackImage;

  const isGrid = viewMode === "grid";

  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: isGrid ? "column" : "row",
            gap: 3,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: isGrid ? "100%" : 200,
              minWidth: isGrid ? "100%" : 200,
              height: isGrid ? 180 : 150,
              borderRadius: 2,
              overflow: "hidden",
              backgroundColor: "#eeeeee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #ddd",
            }}
          >
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
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              {post.title}
            </Typography>

            <Typography
              variant="body2"
              color="primary"
              sx={{ mb: 1, fontStyle: "italic" }}
            >
              {post.name || post.email}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              הפוסט עלה {timeAgo(post.created_at)}
            </Typography>

            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {expanded ? post.body : shortText + "..."}
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
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