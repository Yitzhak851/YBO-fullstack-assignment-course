// this component is responsible for rendering a single post in the list of posts.
// It displays the post title, user email, and a short preview of the post body.
// The user can click a button to expand the post body and read the full content.
import { useState } from "react";
import { Card, CardContent, Typography, Button, Box, } from "@mui/material";

// this fofo component renders a single post in the list of posts. 
// It displays the post title, user email, and a short preview of the post body. 
// The user can click a button to expand the post body and read the full content.
function SinglePost({ post }) {
  const [expanded, setExpanded] = useState(false);

  const shortText = post.body
    .split("\n")
    .slice(0, 3)
    .join("\n");

  return (
    <Card sx={{ p: 2, minHeight: 260, }}>
      <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, textAlign: "center", }} > {post.title} </Typography>
        <Typography variant="body2" color="primary" sx={{ mb: 3, textAlign: "center", fontStyle: "italic", }} > user{post.userId}@example.com </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", textAlign: "center", flexGrow: 1, }} > {expanded ? post.body : shortText + "..."} </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3, }} >
          <Button variant="contained" size="small" onClick={() => setExpanded(!expanded)} > {expanded ? "Show Less" : "Read More"} </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default SinglePost;