// this component is responsible for rendering a single post in the list of posts. It displays the post title, user email, and a short preview of the post body. The user can click a button to expand the post body and read the full content.

import { useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

function SinglePost({ post }) {
  const [expanded, setExpanded] = useState(false);

  const shortText = post.body.split("\n").slice(0, 3).join("\n");

  return (
    <Card sx={{ height: "100%", boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {post.title}
        </Typography>

        <Typography variant="body2" color="primary" sx={{ mb: 2 }}>
          user{post.userId}@example.com
        </Typography>

        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-line", minHeight: "70px" }}
        >
          {expanded ? post.body : shortText + "..."}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Read More"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SinglePost;