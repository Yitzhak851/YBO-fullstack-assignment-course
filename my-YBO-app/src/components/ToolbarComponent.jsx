// this file responsible for the toolbar component of the application, which includes the navigation links and the app title. It uses Material-UI components to create a responsive and visually appealing toolbar.
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
// import { Link } from "@mui/material";
import { Link } from "react-router-dom";




function ToolbarComponent() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 3 }}>
          MyApp
        </Typography>

        <Button variant="contained" color="warning" component={Link} to="/new-post">
          + New Post
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/users">Users</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ToolbarComponent;