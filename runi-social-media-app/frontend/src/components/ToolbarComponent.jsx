import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function ToolbarComponent() {
  const { currentUser, isLoggedIn, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 3 }}>
          MyApp
        </Typography>

        {isLoggedIn && (
          <Button variant="contained" color="warning" component={Link} to="/new-post">
            + New Post
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/users">Users</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>

          {isLoggedIn ? (
            <>
              <Typography component="span" sx={{ mx: 2 }}>
                {currentUser.email}
              </Typography>

              <Button color="warning" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ToolbarComponent;