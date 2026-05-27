// App.jsx - runi-social-media-app
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages - importing the pages for routing
import CreatePostPage from "./pages/CreatePostPage";
import ExplorePage from "./pages/ExplorePage";
import FeedPage from "./pages/FeedPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

// Components - importing the components used across the app
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import ProtectedRoute from "./components/ProtectedRoute";

// Routes 
// import ProtectedRoute from "./routes/ProtectedRoute";

// import Navbar from "./components/ToolbarComponent";

// function App() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>}/>
//       <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>}/>
//       <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>}/>
//       <Route path="/messages"element={<ProtectedRoute><Messages /></ProtectedRoute>}/>
//       <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
//     </Routes>
//   );
// }

function App() {
  return (
    <>
      <Navbar />
      {/* <ToolbarComponent /> */}

      <main className="page-container">
        
        <Routes>          
          {/* Pages routes */}
          <Route path="/" element={<Navigate to="/feed" />} />
          <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Component Routes */}
          <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/search" element={<h1>Search Page</h1>} />
        </Routes>

      </main>
    </>
  );
}

export default App;