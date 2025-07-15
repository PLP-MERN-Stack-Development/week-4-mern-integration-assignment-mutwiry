import { useState, useEffect, useCallback } from 'react';
import useApi from '../hooks/useApi';
import { getPosts } from '../services/postService';
import PostItem from '../components/PostItem';
import { PostCardSkeleton } from '../components/ui/Skeleton';

export default function HomePage() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');

  // API integration
  const { data: postsData, loading, error, request } = useApi(getPosts);

  // Handlers
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get('search');
    setSearchTerm(searchValue);
    request(1, searchValue);
  }, [request]);

  const handlePageChange = useCallback((page) => {
    request(page, searchTerm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [request, searchTerm]);

  useEffect(() => {
    request(1, '');
  }, [request]);

  console.log('HomePage state:', { postsData, loading, error });

  // Render logic
  if (loading && !postsData) {
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading posts</h1>
          <p className="text-gray-600 mb-4">{error.message || 'An error occurred while fetching posts.'}</p>
          <button
            onClick={() => request(1, '')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const posts = postsData?.data;

  if (!posts || posts.length === 0) {
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
                request(1, '');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Clear Search
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
          {postsData?.pagination && postsData?.pagination?.totalPages > 1 && (
            <div className="mt-12">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(postsData?.pagination?.currentPage - 1)}
                  disabled={!postsData?.pagination?.hasPreviousPage}
                  className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                    postsData?.pagination?.hasPreviousPage
                      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  } text-sm font-medium`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: postsData?.pagination?.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      page === postsData?.pagination?.currentPage
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(postsData?.pagination?.currentPage + 1)}
                  disabled={!postsData?.pagination?.hasNextPage}
                  className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                    postsData?.pagination?.hasNextPage
                      ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  } text-sm font-medium`}
                >
                  Next
                </button>
              </nav>
              
              <div className="hidden md:flex justify-center mt-4 text-sm text-gray-500">
                Showing {postsData?.pagination?.currentPage === 1 ? 1 : (postsData?.pagination?.currentPage - 1) * 10 + 1}
                {' to '}
                {Math.min(postsData?.pagination?.currentPage * 10, postsData?.pagination?.totalItems)}
                {' of '}
                {postsData?.pagination?.totalItems} posts
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}