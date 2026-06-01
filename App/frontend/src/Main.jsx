import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Feed from './pages/Feed';
import UserProfile from './pages/UserProfile';
import SearchUsers from './pages/SearchUsers';
import CreatePost from './pages/CreatePost';
import './App.css';

function Main() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/feed" element={isAuthenticated ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
          <Route path="/search" element={isAuthenticated ? <SearchUsers /> : <Navigate to="/login" />} />
          <Route path="/create-post" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/feed" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Main;