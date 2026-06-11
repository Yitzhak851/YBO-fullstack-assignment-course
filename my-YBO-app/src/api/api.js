// my-YBO-app/src/api/api.js - This file contains functions to interact with the backend API
// const BASE_URL = "https://jsonplaceholder.typicode.com";
// const BASE_URL = "http://127.0.0.1:5000";
const BASE_URL = "http://localhost:5000/api";

// API functions to interact with the backend server
export async function fetchPosts(start = 0, limit = 10, userId = null) {
  const userParam = userId ? `&userId=${userId}` : "";
  const response = await fetch(
    `${BASE_URL}/posts?start=${start}&limit=${limit}${userParam}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

// export async function fetchPosts(start = 0, limit = 10, userId) {
//   let url = `http://localhost:5000/api/posts?start=${start}&limit=${limit}`;
//   if (userId) {
//     url += `&userId=${userId}`;
//   }
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Failed to fetch posts");
//   }
//   return await response.json();
// }

// Additional API functions can be added here, such as fetching users, creating posts, etc.
export async function fetchUsers(start = 0, limit = 10, search = "") {
  const response = await fetch(
    `${BASE_URL}/users?start=${start}&limit=${limit}&search=${search}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
}


export async function createPost(postData) {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error("Failed to create post");
  }
  return response.json();
}

export async function followUser(userId, followerId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/follow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ followerId }),
  });

  return response.json();
}

export async function unfollowUser(userId, followerId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/follow`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ followerId }),
  });

  return response.json();
}

export async function fetchFollowStats(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}/follow-stats`);

  if (!response.ok) {
    throw new Error("Failed to fetch follow stats");
  }

  return response.json();
}