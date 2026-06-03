// my-YBO-app/src/components/UserProfile.jsx
// This component fetches and displays a user's profile information,
// followers/following count, and their posts based on the user ID from the URL parameters.

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";

function UserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${id}`
        );

        const data = await response.json();

        setUser(data.user);
        setPosts(data.posts);
        setFollowers(data.followers || 0);
        setFollowing(data.following || 0);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Failed to load user profile");
      }
    }

    fetchUserProfile();
  }, [id]);

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Card>
        <CardContent>
          <Avatar
            src={user.profile_picture}
            alt={user.name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />

          <Typography variant="h5">
            {user.name || "Unknown User"}
          </Typography>

          <Typography color="text.secondary">
            {user.email}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            {user.bio || "No bio yet"}
          </Typography>

          <Box sx={{ display: "flex", gap: 4, mt: 3 }}>
            <Typography variant="body1">
              <strong>Followers:</strong> {followers}
            </Typography>

            <Typography variant="body1">
              <strong>Following:</strong> {following}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" sx={{ mt: 4 }}>
        User Posts
      </Typography>

      {posts.length === 0 ? (
        <Typography sx={{ mt: 2 }}>
          This user has no posts yet.
        </Typography>
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6">
                {post.title}
              </Typography>

              <Typography>
                {post.body}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default UserProfile;