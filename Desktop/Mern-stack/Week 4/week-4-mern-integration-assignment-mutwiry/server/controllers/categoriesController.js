export const getAllCategories = (req, res) => {
  res.json([{ name: "Tech" }, { name: "Lifestyle" }]);
};

export const createCategory = (req, res) => {
  res.json({ message: "Category created (mock)" });
};
