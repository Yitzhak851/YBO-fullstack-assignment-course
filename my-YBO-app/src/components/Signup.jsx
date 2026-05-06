import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import { Link } from "react-router-dom";

function Signup() {
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
            Create Account
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Sign up for a new account
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

          <TextField
            fullWidth
            label="Repeat Password"
            type="password"
            margin="normal"
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Sign Up
          </Button>

          <Typography
            align="center"
            variant="body2"
            sx={{ mt: 3 }}
          >
            Already have an account?
          </Typography>

          <Typography align="center">
            <Link to="/login">Login</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Signup;