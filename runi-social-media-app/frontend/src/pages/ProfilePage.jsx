import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import PostCard from "../components/PostCard";

function ProfilePage() {
  const { userId } = useParams();

  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    const response = await api.get(`/users/${userId}`);
    setProfile(response.data);
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <section>
      <div className="profile-card">
        {profile.profile_picture_url && (
          <img
            className="profile-picture"
            src={profile.profile_picture_url}
            alt={profile.username}
          />
        )}

        <h1>{profile.name}</h1>
        <h2>@{profile.username}</h2>
        <p>{profile.bio}</p>

        <div className="profile-stats">
          <span>{profile.followers_count} followers</span>
          <span>{profile.following_count} following</span>
        </div>
      </div>

      <h2>Posts</h2>

      {profile.posts.map((post) => (
        <PostCard key={post.id} post={post} onPostUpdated={fetchProfile} />
      ))}
    </section>
  );
}

export default ProfilePage;