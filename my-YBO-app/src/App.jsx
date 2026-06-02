// App.jsx - my-YBO-app
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
import ProtectedRoute from "./auth/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ToolbarComponent />

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-post" element={<ProtectedRoute> <NewPost /> </ProtectedRoute>} />
        <Route path="/search" element={<Search />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        <Route path="/ToolbarComponent" element={<ToolbarComponent />} />
        <Route path="/user/:userId" element={<User />} />
        <Route path="/users" element={<Users />} />
        {/* <Route path="/user-posts/:userId" element={<Feed />} /> */}
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;