const BASE_URL = "https://jsonplaceholder.typicode.com";

const api = {
  post: async (url, data) => {
    if (url === "/auth/login" || url === "/auth/register") {
      const fakeUser = {
        id: Date.now(),
        name: data.name || "Demo User",
        email: data.email,
      };

      return {
        data: {
          token: "demo-token",
          user: fakeUser,
        },
      };
    }

    throw new Error(`Unsupported POST request: ${url}`);
  },
};

export async function fetchPosts(start = 0, limit = 10, userId = null) {
  const userParam = userId ? `&userId=${userId}` : "";
  const response = await fetch(
    `${BASE_URL}/posts?_start=${start}&_limit=${limit}${userParam}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}

export async function fetchUsers(start = 0, limit = 10, search = "") {
  const response = await fetch(`${BASE_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const users = await response.json();

  return users
    .filter((user) =>
      user.email.toLowerCase().includes(search.toLowerCase())
    )
    .slice(start, start + limit);
}

export async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=20");
  return res.json();
}

export async function getUsers() {
  const res = await fetch("https://randomuser.me/api/?results=20");
  const data = await res.json();
  return data.results;
}

export async function getImages() {
  const res = await fetch("https://picsum.photos/v2/list?page=2&limit=20");
  return res.json();
}

export default api;

// TODO: Replace with real API calls when backend is ready
// import axios from "axios";
// const api = axios.create({
//   baseURL: "http://localhost:5000/api"
// });
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
// export default api;