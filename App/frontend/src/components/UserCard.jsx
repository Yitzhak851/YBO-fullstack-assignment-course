import React from 'react';
import './UserCard.css';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <div className="user-card-header">
        <img src={user.avatar} alt={user.name} className="user-avatar" />
      </div>
      <div className="user-card-body">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <p className="user-role">{user.role}</p>
      </div>
      <div className="user-card-footer">
        <button className="btn-view">View Profile</button>
      </div>
    </div>
  );
};

export default UserCard;
