// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../api/api";
// import PostCard from "../components/PostCard";

// function ProfilePage() {
//   const { userId } = useParams();

//   const [profile, setProfile] = useState(null);

//   const fetchProfile = async () => {
//     const response = await api.get(`/users/${userId}`);
//     setProfile(response.data);
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, [userId]);

//   if (!profile) {
//     return <p>Loading profile...</p>;
//   }

//   return (
//     <section>
//       <div className="profile-card">
//         {profile.profile_picture_url && (
//           <img
//             className="profile-picture"
//             src={profile.profile_picture_url}
//             alt={profile.username}
//           />
//         )}

//         <h1>{profile.name}</h1>
//         <h2>@{profile.username}</h2>
//         <p>{profile.bio}</p>

//         <div className="profile-stats">
//           <span>{profile.followers_count} followers</span>
//           <span>{profile.following_count} following</span>
//         </div>
//       </div>

//       <h2>Posts</h2>

//       {profile.posts.map((post) => (
//         <PostCard key={post.id} post={post} onPostUpdated={fetchProfile} />
//       ))}
//     </section>
//   );
// }

// export default ProfilePage;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`http://localhost:5000/users/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (loading) {
    return <h2>Loading profile...</h2>;
  }

  if (!user) {
    return <h2>User not found</h2>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  );
}

export default Profile;