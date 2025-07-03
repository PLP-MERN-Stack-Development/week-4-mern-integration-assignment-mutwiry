import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useApi from '../hooks/useApi';
import PostForm from '../components/PostForm';
import { createPost } from '../services/postService';

export default function CreatePost() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { execute, loading } = useApi(createPost);

  // Clear success message when location changes
  useEffect(() => {
    setSuccess('');
  }, [location.pathname]);

  const handleSubmit = async (postData) => {
    try {
      setError('');
      const response = await execute({
        ...postData,
        // Ensure categories is an array as expected by the backend
        categories: postData.category ? [postData.category] : []
      });
      
      if (response?.data?._id) {
        setSuccess('Post created successfully! Redirecting...');
        setTimeout(() => {
          navigate(`/posts/${response.data._id}`);
        }, 1500);
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
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
            <p>{success}</p>
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