// this componnant  creates a toolbar component using Material-UI's AppBar and Toolbar components. 
// It includes a title on the left and several buttons on the right for navigation. 
// The buttons are styled with the "inherit" color to match the AppBar's theme.
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

// This component creates a toolbar with the title "My Blog App" on the left and navigation buttons on the right.
function ToolbarComponent() {
  return (
    <AppBar position="static">
      <Toolbar>

        {/* צד שמאל - שם האפליקציה */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Blog App
        </Typography>

        {/* צד ימין - כפתורים */}
        <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Create Post</Button>
          <Button color="inherit">Search</Button>
          <Button color="inherit">Profile</Button>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default ToolbarComponent;