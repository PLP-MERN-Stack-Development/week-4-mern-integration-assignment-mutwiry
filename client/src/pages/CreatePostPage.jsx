import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import PostForm from '../components/PostForm';
import { createPost } from '../services/postService';
import Layout from '../components/Layout';

export default function CreatePost() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { execute, loading } = useApi(createPost, false);

  const handleSubmit = async (postData) => {
    try {
      const response = await execute(postData);
      if (response && response.data) {
        return response; // This will be used by PostForm for navigation
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create post';
      setError(errorMessage);
      throw err; // Re-throw to be caught by PostForm
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <PostForm 
            onSubmit={handleSubmit} 
            isEditing={false}
          />
        </div>
      </div>
    </Layout>
  );
}