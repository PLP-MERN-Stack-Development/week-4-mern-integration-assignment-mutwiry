import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import PostForm from '../components/PostForm';
import { getPostById, updatePost } from '../services/postService';
import Layout from '../components/Layout';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');
  
  // Fetch the post data
  const { execute: fetchPost, loading: loadingPost } = useApi(
    () => getPostById(id),
    false
  );

  // Handle the update API call
  const { execute: updatePostApi, loading: updating } = useApi(updatePost, false);

  // Load post data when component mounts
  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetchPost();
        setPost(response.data);
      } catch (err) {
        setError('Failed to load post. It may have been deleted or you may not have permission to edit it.');
        console.error('Error loading post:', err);
      }
    };

    loadPost();
  }, [id, fetchPost]);

  const handleSubmit = async (postData) => {
    try {
      const response = await updatePostApi(id, postData);
      if (response && response.data) {
        navigate(`/post/${id}`); // Navigate back to the post after successful update
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update post';
      setError(errorMessage);
      throw err; // Re-throw to be caught by PostForm
    }
  };

  if (loadingPost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p>Loading post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post && !loadingPost) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Post Not Found</h2>
            <p className="mb-4">The post you're trying to edit doesn't exist or you don't have permission to edit it.</p>
            <button 
              onClick={() => navigate('/')} 
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <PostForm 
            onSubmit={handleSubmit} 
            initialData={post}
            isEditing={true}
          />
        </div>
      </div>
    </Layout>
  );
}