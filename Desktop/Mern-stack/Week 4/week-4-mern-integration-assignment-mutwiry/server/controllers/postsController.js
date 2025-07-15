export const getAllPosts = (req, res) => {
  res.json([{ title: "Sample post", content: "This is a sample post" }]);
};

export const getPostById = (req, res) => {
  const { id } = req.params;
  res.json({ id, title: "Single post", content: "This is the post content" });
};

export const createPost = (req, res) => {
  res.json({ message: "Post created (mock)" });
};

export const updatePost = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Post ${id} updated (mock)` });
};

export const deletePost = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Post ${id} deleted (mock)` });
};
