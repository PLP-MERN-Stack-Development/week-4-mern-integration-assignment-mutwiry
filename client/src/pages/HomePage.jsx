import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { getAllPosts as postService } from '../services/postService';
import PostItem from '../components/PostItem';
import { PostCardSkeleton } from '../components/ui/Skeleton';

export default function HomePage() {
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  
  // Create a stable API function that doesn't change between renders
  const fetchPosts = useCallback((page = 1, search = '') => {
    return postService(page, search);
  }, []);

  // Use our custom hook to call the API with pagination and search
  const { data, error, loading, execute } = useApi(fetchPosts);
  
  // Process the API response when data changes
  useEffect(() => {
    if (!data) return;
    
    console.log('Processing API response:', { data });
    
    // Handle different possible response structures
    let postsData = [];
    let paginationData = null;
    
    // Case 1: Data is an array (direct posts array)
    if (Array.isArray(data)) {
      postsData = data;
    }
    // Case 2: Data has a `data` property that's an array
    else if (data.data && Array.isArray(data.data)) {
      postsData = data.data;
      // Check for pagination in various possible locations
      paginationData = data.pagination || data.meta?.pagination || null;
    }
    // Case 3: Data has a nested `data` property that's an array
    else if (data.data?.data && Array.isArray(data.data.data)) {
      postsData = data.data.data;
      paginationData = data.data.pagination || data.data.meta?.pagination || null;
    }
    
    // Update posts state
    setPosts(postsData);
    
    // Update pagination state if pagination data exists
    if (paginationData) {
      setPagination({
        currentPage: paginationData.currentPage || 1,
        totalPages: paginationData.totalPages || 1,
        totalItems: paginationData.totalItems || postsData.length,
        hasNextPage: paginationData.hasNextPage || false,
        hasPreviousPage: paginationData.hasPreviousPage || false
      });
    }
  }, [data]);
  
  // Execute the API call when dependencies change
  useEffect(() => {
    execute(currentPage, searchTerm);
  }, [currentPage, searchTerm, execute]);
  
  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get('search');
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center p-4">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Loading posts...</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading posts</h1>
          <p className="text-gray-600 mb-4">{error.message || 'An error occurred while fetching posts.'}</p>
          <button
            onClick={() => execute(currentPage, searchTerm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!loading && posts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No posts found</h1>
          <p className="text-gray-600 mb-6">
            {searchTerm 
              ? `No posts found matching "${searchTerm}". Try a different search term.`
              : 'There are no posts to display at the moment.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex rounded-md shadow-sm">
              <input
                type="text"
                name="search"
                defaultValue={searchTerm}
                placeholder="Search posts..."
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </form>

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-12">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                    pagination.hasPreviousPage
                      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  } text-sm font-medium`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      page === pagination.currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                    pagination.hasNextPage
                      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  } text-sm font-medium`}
                >
                  Next
                </button>
              </nav>
              
              <div className="hidden md:flex justify-center mt-4 text-sm text-gray-500">
                Showing {pagination.currentPage === 1 ? 1 : (pagination.currentPage - 1) * 10 + 1}
                {' to '}
                {Math.min(pagination.currentPage * 10, pagination.totalItems)}
                {' of '}
                {pagination.totalItems} posts
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
