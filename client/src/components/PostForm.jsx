import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
// Assume you have a categoryService to fetch categories
// import * as categoryService from '../services/categoryService'; 

export default function PostForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.category?._id || '');
  
  // You would fetch categories and populate this list
  const [categories, setCategories] = useState([]); 
  const { loading, error } = useApi(() => {}); // Just for loading/error state from the parent submit function
  const navigate = useNavigate();

  // In a real app, you'd fetch categories here with another useApi hook
  useEffect(() => {
    // Faking categories for this example
    setCategories([ { _id: '655e8b4e4a781e22a7a4f4d2', name: 'Tech' }, { _id: '655e8b584a781e22a7a4f4d5', name: 'Lifestyle' }]);
    if (initialData.category) {
        setCategory(initialData.category._id);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = { title, content, category };
      const result = await onSubmit(postData);
      navigate(`/post/${result.data._id}`); // Navigate to the new/updated post
    } catch (err) {
      console.error("Failed to submit post:", err);
      // The useApi hook in the parent component will set the error state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block font-bold">Title</label>
        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border rounded" />
      </div>
      <div>
        <label htmlFor="category" className="block font-bold">Category</label>
        <select id="category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full p-2 border rounded">
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="content" className="block font-bold">Content</label>
        <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows="10" className="w-full p-2 border rounded" />
      </div>
      <button type="submit" disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400">
        {loading ? 'Submitting...' : (isEditing ? 'Update Post' : 'Create Post')}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}