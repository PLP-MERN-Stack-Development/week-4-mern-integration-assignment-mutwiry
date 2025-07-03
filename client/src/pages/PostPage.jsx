import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '../services/postService';
import { format, isValid } from 'date-fns';
import Spinner from '../components/Spinner';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        console.error('No post ID provided in URL');
        setError('No post ID provided');
        setLoading(false);
        return;
      }

      console.log('Fetching post with ID:', id);
      setLoading(true);
      setError('');
      
      try {
        const response = await getPostById(id);
        console.log('API Response:', response);
        
        // The backend returns { success: true, data: post } structure
        if (response?.data?.data) {
          console.log('Post data:', response.data.data);
          setPost(response.data.data);
        } else {
          console.error('No post data in response:', response);
          setError('Post not found or empty response');
        }
      } catch (err) {
        console.error('Error fetching post:', {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        setError(err.response?.data?.message || 'Failed to load post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Spinner />
        <p className="mt-4 text-gray-600">Loading post {id ? `#${id}` : ''}...</p>
      </div>
    );
  }

  if (error || !post) {
    console.log('Rendering error state:', { error, hasPost: !!post });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Post not found</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>{error || 'The post you are looking for does not exist or has been removed.'}</p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <article className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-6 py-8 sm:p-10">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title || 'Untitled Post'}
              </h1>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span>Posted on {formatDate(post.createdAt)}</span>
                {post.updatedAt && post.updatedAt > post.createdAt && (
                  <span className="ml-2">
                    (Updated on {formatDate(post.updatedAt)})
                  </span>
                )}
              </div>
              
              {post.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map(category => (
                    <span 
                      key={category._id || category} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {category.name || category}
                    </span>
                  ))}
                </div>
              )}
            </header>
            
            <div className="prose max-w-none">
              {post.content ? (
                <div className="whitespace-pre-line">{post.content}</div>
              ) : (
                <p className="text-gray-500 italic">No content available for this post.</p>
              )}
            </div>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 sm:px-10">
            <div className="flex justify-between items-center">
              <div className="space-x-3">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  ← Back to posts
                </button>
                <button
                  onClick={() => navigate(`/edit-post/${id}`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Post
                </button>
              </div>
              
              {post.userId && (
                <div className="text-sm text-gray-500">
                  Posted by: {typeof post.userId === 'object' ? post.userId.name : 'Unknown author'}
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default PostPage;