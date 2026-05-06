const BASE_URL = "https://jsonplaceholder.typicode.com";

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