import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { getAllPosts as fetchAllPosts } from '../services/postService';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState(null);
  
  // Use our custom hook to call the API with pagination and search
  const { data, error, loading, execute } = useApi(
    useCallback(() => fetchAllPosts(currentPage, searchTerm), [currentPage, searchTerm]),
    true // Set immediate to true to fetch on mount and when currentPage or searchTerm changes
  );
  
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get('search');
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Update pagination when data changes
  useEffect(() => {
    if (data?.pagination) {
      setPagination(data.pagination);
    }
  }, [data]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && !data) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  // Ensure we have data and it's an array before mapping
  const posts = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex">
              <input
                type="text"
                name="search"
                placeholder="Search posts..."
                className="flex-1 p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                defaultValue={searchTerm}
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition duration-150 ease-in-out"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
          <Link 
            to="/create-post" 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out text-center"
          >
            Create New Post
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                <Link 
                  to={`/posts/${post._id}`} 
                  className="text-gray-900 hover:text-indigo-600 transition-colors duration-200"
                >
                  {post.title}
                </Link>
              </h2>
              
              {post.categories?.length > 0 && (
                <div className="flex flex-wrap gap-2 my-2">
                  {post.categories.map(category => (
                    <span 
                      key={category._id} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="mt-3 text-gray-600 line-clamp-3">
                {post.content}
              </p>
              
              <div className="mt-4">
                <Link 
                  to={`/posts/${post._id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center"
                >
                  Read more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={pagination.currentPage === 1 || loading}
            className={`px-4 py-2 rounded-md ${pagination.currentPage === 1 || loading 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Previous
          </button>
          
          <span className="text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages || loading}
            className={`px-4 py-2 rounded-md ${pagination.currentPage === pagination.totalPages || loading 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}