import { BrowserRouter, Routes, Route } from "react-router-dom";
import ToolbarComponent from "./components/ToolbarComponent";
import Feed from "./components/Feed";
import Users from "./components/Users";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NewPost from "./components/NewPost";

function App() {
  return (
    <BrowserRouter>
      <ToolbarComponent />

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user-posts/:userId" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new-post" element={<NewPost />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;