// my-YBO-app/src/App.jsx : Setting Pages/Routes and define which URL renders which component
// some necessary imports for routing and components
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./components/Feed";
import Login from "./components/Login";
import NewPost from "./components/NewPost";
import Search from "./components/Search";
import Signup from "./components/Signup";
import SinglePost from "./components/SinglePost";
import ToolbarComponent from "./components/ToolbarComponent";
import User from "./components/User";
import Users from "./components/Users";
import UserProfile from "./components/UserProfile";
import ProtectedRoute from "./auth/ProtectedRoute";
import Home from "./components/Feed";



function App() {
  return (
    <BrowserRouter>
      <ToolbarComponent />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-post" element={<ProtectedRoute> <NewPost /> </ProtectedRoute>} />
        <Route path="/search" element={<Search />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        <Route path="/ToolbarComponent" element={<ToolbarComponent />} />
        <Route path="/user/:userId" element={<User />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserProfile />} />
        
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;