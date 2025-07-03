import { useState, useEffect } from 'react';

export default function PostForm({ onSubmit, initialData = {}, isEditing = false, loading = false }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([
    { _id: '655e8b4e4a781e22a7a4f4d2', name: 'Tech' }, 
    { _id: '655e8b584a781e22a7a4f4d5', name: 'Lifestyle' }
  ]);
  const [category, setCategory] = useState('');

  // Initialize form with initialData when it changes
  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      if (initialData.category) {
        setCategory(initialData.category._id || '');
      }
    }
  }, [initialData, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit({ 
        title, 
        content,
        category: category || undefined // Only include if category is selected
      });
    } catch (err) {
      // Error is already handled in the parent component
      console.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          placeholder="Enter post title"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          rows={10}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          placeholder="Write your post content here..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            'Saving...'
          ) : isEditing ? (
            'Update Post'
          ) : (
            'Create Post'
          )}
        </button>
      </div>
    </form>
  );
}