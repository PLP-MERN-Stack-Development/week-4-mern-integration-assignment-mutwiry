import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import PostForm from '../components/PostForm';
import { createPost } from '../services/postService';

export default function CreatePost() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { execute, loading } = useApi(createPost);

  const handleSubmit = async (postData) => {
    try {
      const response = await execute({
        ...postData,
        // Ensure categories is an array as expected by the backend
        categories: postData.category ? [postData.category] : []
      });
      
      if (response?.data?._id) {
        navigate(`/posts/${response.data._id}`);
      }
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create post. Please try again.';
      setError(errorMessage);
      throw err; // Re-throw to be caught by PostForm
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Create New Post</h1>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}
        <PostForm 
          onSubmit={handleSubmit} 
          isEditing={false}
          loading={loading}
        />
      </div>
    </div>
  );
}