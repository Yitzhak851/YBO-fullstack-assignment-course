import { useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

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
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
          >
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

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            {error && (
              <Typography
                color="error"
                sx={{ mt: 2 }}
              >
                {error}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              type="submit"
            >
              Login
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            OR
          </Divider>

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