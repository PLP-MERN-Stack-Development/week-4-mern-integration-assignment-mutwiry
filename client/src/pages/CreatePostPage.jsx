import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import PostForm from '../components/PostForm';
import { createPost } from '../services/postService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreatePost() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState({ show: false, postId: null });
  const navigate = useNavigate();
  const location = useLocation();
  const { execute, loading, data, error: apiError } = useApi(createPost, false);

  // Clear success message when location changes
  useEffect(() => {
    return () => {
      setSuccess({ show: false, postId: null });
    };
  }, [location.pathname]);

  // Handle successful post creation
  useEffect(() => {
    console.log('Checking data for success:', data);
    if (data && (data._id || (data.data && data.data._id))) {
      const postId = data._id || data.data._id;
      console.log('Post created successfully with ID:', postId);
      setSuccess({ show: true, postId });
    }
  }, [data]);

  // Handle API errors
  useEffect(() => {
    if (apiError) {
      console.error('API Error:', apiError);
      setError(apiError);
    }
  }, [apiError]);

  const handleSubmit = async (postData) => {
    console.log('Form submitted with data:', postData);
    setError('');
    
    try {
      // Validate required fields
      if (!postData.category) {
        throw new Error('Please select a category');
      }

      // Prepare the data to send
      const postToCreate = {
        title: postData.title,
        content: postData.content,
        category: postData.category, // Send as single category ID
        featuredImage: postData.featuredImage || ''
      };
      
      console.log('Post data being sent to API:', {
        ...postToCreate,
        // Log the category type for debugging
        _categoryType: typeof postToCreate.category,
        _categoryValue: postToCreate.category
      });
      
      // Make the API call
      const response = await execute(postToCreate);
      console.log('API Response:', response);
      
      if (response?.data?.success) {
        // Show success message
        toast.success('Post created successfully!');
        
        // Redirect to the home page after a short delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
        
        return response.data;
      } else {
        throw new Error('Failed to create post: Invalid response from server');
      }
    } catch (err) {
      console.error('Error in form submission:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });
      
      let errorMessage = 'Failed to create post. Please try again.';
      
      if (err.response) {
        // Server responded with an error
        errorMessage = err.response.data?.message || 
                      `Server error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message || 'Error setting up request';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Success message component
  const SuccessMessage = () => (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            Post created successfully!
          </p>
          <div className="mt-2">
            <Link
              to={`/posts/${success.postId}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              View Post
            </Link>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="ml-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => setSuccess({ show: false, postId: null })}
              className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Create Another Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success.show ? (
          <div>
            <SuccessMessage />
            <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Create another post</h2>
              <PostForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </div>
        ) : (
          <PostForm onSubmit={handleSubmit} loading={loading} />
        )}
      </div>
    </div>
  );
}