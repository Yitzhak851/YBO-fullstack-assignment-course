// ToolbarComponent.jsx
// import necessary components and hooks from Material-UI and React Router
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// This fofo component renders the top navigation bar of the application, 
// which includes links to different pages and displays the current user's email if they are logged in. 
// It also provides a logout button for authenticated users and a login button for unauthenticated users.
function ToolbarComponent() {
  // Access authentication state and functions from the AuthContext
  const { currentUser, isLoggedIn, logout } = useAuth();
  // Render the AppBar with navigation links and user information
  return (
    <AppBar position="static">
      <Toolbar>
        {/* ================================= InstaRUNI ================================= */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mr: 3 }}> 
          <Button color="inherit" component={Link} to="/"> InstaRUNI </Button>
        </Typography>
        {isLoggedIn && (<Button variant="contained" color="warning" component={Link} to="/new-post"> + New Post </Button>)}
        <Box sx={{ flexGrow: 1 }} />
        <Box>
          {/* =================  Home + Users Button ======================  */} 
          <Button color="inherit" component={Link} to="/"> Home </Button>
          <Button color="inherit" component={Link} to="/users"> Users </Button>

          {isLoggedIn ? (
            <> <Typography component="span" sx={{ mx: 2 }}> {currentUser.email} </Typography>
              {/* =================  Logout Button ======================  */} 
              <Button color="warning" onClick={logout}> Logout </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login"> Login </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default ToolbarComponent;