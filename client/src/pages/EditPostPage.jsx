import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { getPostById, updatePost } from '../services/postService'; 
import Spinner from '../components/Spinner';

export default function EditPostPage() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('No post ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching post with ID: ${id}`);
        const response = await getPostById(id);
        console.log('Post data received:', response);
        
        if (response?.data?.data) {
          setPost(response.data.data);
        } else {
          throw new Error('No post data received');
        }
      } catch (err) {
        console.error('Error fetching post:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.message || 'Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (postData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await updatePost(id, postData);
      if (response?.data?._id) {
        navigate(`/posts/${response.data._id}`);
      } else {
        throw new Error('Failed to update post');
      }
    } catch (err) {
      console.error('Error updating post:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  
  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    </div>
  );

  return (
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
  );
}