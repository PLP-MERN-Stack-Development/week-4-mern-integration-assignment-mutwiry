import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { getPostById, updatePost } from '../services/postService'; 
import Spinner from '../components/Spinner';
import Layout from '../components/Layout';

export default function EditPostPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById(id);
        setPost(response.data.data); 
      } catch (err) {
        setError('Failed to fetch post. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (postData) => {
    try {
      await updatePost(id, postData);
      navigate(`/post/${id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update post';
      setError(errorMessage);
      throw err; 
    }
  };

  if (loading) return (
    <Layout>
      <Spinner />
    </Layout>
  );
  if (error) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-red-500 text-center">{error}</div>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
          {post && (
            <PostForm 
              initialData={post} 
              onSubmit={handleUpdate} 
              isEditing={true} 
            />
          )}
        </div>
      </div>
    </Layout>
  );
}