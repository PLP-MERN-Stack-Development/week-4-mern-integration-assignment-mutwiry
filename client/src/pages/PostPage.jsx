import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPostById } from '../services/postService';
import { format, isValid } from 'date-fns';
import Spinner from '../components/Spinner';

// Helper function to safely extract ID from URL
const extractIdFromPath = (pathname) => {
  if (!pathname) return null;
  const segments = pathname.split('/').filter(Boolean);
  // Look for 'posts' segment and get the next segment as ID
  const postsIndex = segments.indexOf('posts');
  if (postsIndex >= 0 && segments.length > postsIndex + 1) {
    return segments[postsIndex + 1];
  }
  // If no 'posts' segment, try to get the last segment as ID
  return segments.length > 0 ? segments[segments.length - 1] : null;
};

const PostPage = () => {
  // All hooks must be called at the top level
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  
  // Memoize the ID extraction to avoid unnecessary recalculations
  const postId = useMemo(() => {
    // Try to get ID from different sources in order of preference
    const idFromParams = paramId;
    const idFromPath = extractIdFromPath(location.pathname);
    const idFromState = location.state?.postId;
    
    console.log('Extracted IDs:', {
      fromParams: idFromParams,
      fromPath: idFromPath,
      fromState: idFromState,
      locationState: location.state,
      locationPathname: location.pathname
    });
    
    // Return the first valid ID found
    return idFromParams || idFromState || idFromPath || null;
  }, [paramId, location.pathname, location.state]);
  
  // Log the ID and route info when it changes
  useEffect(() => {
    console.group('PostPage Mount/Update');
    console.log('Post ID from params:', paramId);
    console.log('Post ID from path:', extractIdFromPath(location.pathname));
    console.log('Post ID from state:', location.state?.postId);
    console.log('Final post ID to use:', postId);
    console.log('Location:', {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state
    });
    
    // Log the current URL for debugging
    console.log('Current URL:', window.location.href);
    
    console.groupEnd();
    
    return () => {
      console.log('PostPage unmounting');
    };
  }, [postId, paramId, location]);

  // Helper function to safely format dates
  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }, []);

  // Fetch post data when postId or retryCount changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchPost = async (idToFetch) => {
      if (!idToFetch || idToFetch === 'undefined' || idToFetch === 'null') {
        console.error('Invalid post ID:', idToFetch);
        if (isMounted) {
          setError('No valid post ID provided');
          setLoading(false);
        }
        return;
      }
      
      console.log('Fetching post with ID:', idToFetch);
      
      if (isMounted) {
        setLoading(true);
        setError('');
      }

      try {
        console.log('Calling getPostById with ID:', idToFetch);
        const startTime = performance.now();
        const response = await getPostById(idToFetch);
        const endTime = performance.now();
        
        console.log(`[PostPage] API call took ${(endTime - startTime).toFixed(2)}ms`, {
          status: response?.status,
          statusText: response?.statusText,
          data: response?.data ? {
            success: response.data.success,
            hasData: !!response.data.data,
            dataKeys: response.data.data ? Object.keys(response.data.data) : []
          } : 'No data in response'
        });
        
        // Handle different response structures
        const postData = response?.data?.data || response?.data;
        
        if (postData) {
          console.log('Post data received:', {
            id: postData._id,
            title: postData.title,
            hasCategories: Array.isArray(postData.categories) && postData.categories.length > 0,
            categoryCount: postData.categories?.length || 0
          });
          
          if (isMounted) {
            setPost(postData);
            setError('');
          }
        } else {
          console.error('No post data in response:', response);
          if (isMounted) {
            setError('Post not found or empty response');
          }
        }
      } catch (err) {
        console.error('Error fetching post:', {
          message: err.message,
          response: err.response,
          stack: err.stack
        });
        
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load post. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // If we have a valid postId, fetch the post
    if (postId) {
      fetchPost(postId);
    } else {
      console.error('No valid post ID available');
      if (isMounted) {
        setError('No valid post ID provided');
        setLoading(false);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [postId, navigate, retryCount]);
  
  // Handle retry logic
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);
  
  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Spinner />
        <p className="mt-4 text-gray-600">
          Loading post {postId ? `#${postId}` : '...'}
        </p>
      </div>
    );
  }
  
  // Handle error state
  if (error || !post) {
    console.log('Rendering error state:', { 
      error, 
      hasPost: !!post,
      postId,
      locationState: location.state,
      currentPath: window.location.pathname
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              {postId ? 'Error loading post' : 'Post not found'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {error || 'The post could not be loaded. Please try again.'}
            </p>
            <div className="mt-6 flex justify-center gap-4">
              {postId && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Retry
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go back home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!post) return null;
    
    return (
      <article className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        
        <div className="flex items-center text-gray-500 text-sm mb-8">
          <span>By {post.user?.name || 'Unknown Author'}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.createdAt)}</span>
          {post.category && (
            <>
              <span className="mx-2">•</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {post.category.name}
              </span>
            </>
          )}
        </div>
        
        {post.featuredImage && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
        
        <div className="prose max-w-none">
          {post.content ? (
            <div className="whitespace-pre-line">{post.content}</div>
          ) : (
            <p className="text-gray-500 italic">No content available for this post.</p>
          )}
        </div>
      </article>
    );
  };

  return renderContent();
};

export default PostPage;