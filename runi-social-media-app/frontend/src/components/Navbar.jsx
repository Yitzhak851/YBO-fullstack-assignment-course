import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/feed" className="navbar-logo">
        RUNI Social
      </Link>

      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/feed">Feed</Link>
            <Link to="/create-post">Create Post</Link>
            <Link to={`/profile/${user.id}`}>My Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;