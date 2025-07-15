const API_URL = import.meta.env.VITE_API_URL || "/api";

// Posts
export const getAllPosts = async () => {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return await res.json();
};

export const getPostById = async (id) => {
  const res = await fetch(`${API_URL}/posts/${id}`);
  if (!res.ok) throw new Error("Failed to fetch post");
  return await res.json();
};

export const createPost = async (postData) => {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return await res.json();
};

// Add updatePost & deletePost similarly
