import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

function Login() {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card sx={{ width: 350, p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" align="center">
            Welcome Back
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Sign in to your account
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Login
          </Button>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/signup"
          >
            Sign Up
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;