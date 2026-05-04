// this file responsible for the toolbar component of the application, which includes the navigation links and the app title. It uses Material-UI components to create a responsive and visually appealing toolbar.

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

function ToolbarComponent() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          MyApp
        </Typography>

        <Box>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Users</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ToolbarComponent;