// App.jsx - runi-social-media-app
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Feed from "./components/Feed";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import CreatePostPage from "./pages/CreatePostPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      {/* <Navbar /> */}

      <main className="page-container">
        
        <Routes>
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
          <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>

      </main>
    </>
  );
}

export default App;