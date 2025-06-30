import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { posts as postService } from '../services/api'; // Renamed for clarity
import PageLayout from '../components/layout/PageLayout';
import PostItem from '../components/PostItem'; // Import the new component
import { PostCardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { useAuth } from '../hooks/useAuth'; // Use the custom hook

const PostList = ({ posts, loading, error, onRetry }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCreatePostClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/posts/create' } });
    } else {
      navigate('/posts/create');
    }
  };

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <PostCardSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading posts</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <div className="mt-6">
          <button onClick={onRetry} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="mt-4 text-xl font-medium text-gray-900">No posts yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          {isAuthenticated ? 'Get started by creating your first post.' : 'Sign in to create one.'}
        </p>
        <div className="mt-6">
          <button onClick={handleCreatePostClick} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Post
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`mt-12 flex items-center justify-between px-4 sm:px-0 ${className}`}>
      <div className="-mt-px w-0 flex-1 flex">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium ${
            currentPage > 1 
              ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Previous
        </button>
      </div>
      
      <div className="hidden md:-mt-px md:flex">
        <span className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      <div className="-mt-px w-0 flex-1 flex justify-end">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium ${
            currentPage < totalPages 
              ? 'text-gray-500 hover:text-gray-700 hover:border-gray-300' 
              : 'text-gray-300 cursor-not-allowed'
          }`}
        >
          Next
          <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  
  const toast = useToast();

  const fetchPosts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching posts for page:', page);
      const response = await posts.getAll(page);
      console.log('Posts API response:', response);
      
      if (response && response.data) {
        setPostsList(response.data);
        setPagination(prev => ({
          ...prev,
          currentPage: response.pagination?.currentPage || page,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || response.data.length,
          hasNextPage: response.pagination?.hasNextPage || false,
          hasPreviousPage: response.pagination?.hasPreviousPage || false,
        }));
      } else {
        console.warn('Unexpected API response format:', response);
        setPostsList([]);
      }
      
      // Show toast for pagination changes if not the first load
      if (page > 1) {
        toast.success(`Loaded page ${page} of posts`);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load posts. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
      setPostsList([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch on component mount
  useEffect(() => {
    console.log('Component mounted, fetching posts...');
    const timer = setTimeout(() => {
      fetchPosts(1);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [fetchPosts]);
  
  // Handle pagination changes
  const handlePageChange = (newPage) => {
    console.log('Page changed to:', newPage);
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPosts(newPage);
    }
  };

  const handleRetry = () => {
    fetchPosts(pagination.currentPage);
  };

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreatePostClick = (e) => {
    e?.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/posts/create' } });
    } else {
      navigate('/posts/create');
    }
  };

  return (
    <ErrorBoundary onReset={handleRetry}>
      <PageLayout 
        title="Latest Blog Posts"
        subtitle="Discover our latest articles and updates"
        headerAction={
          <button
            onClick={handleCreatePostClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Post
          </button>
        }
      >
        <PostList 
          posts={postsList} 
          loading={loading} 
          error={error}
          onRetry={handleRetry}
        />
        
        <Pagination 
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </PageLayout>
    </ErrorBoundary>
  );
};

export default HomePage;
