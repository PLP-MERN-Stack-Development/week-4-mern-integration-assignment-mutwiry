import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { getAllPosts as fetchAllPosts } from '../services/postService';

export default function HomePage() {
  // Use our custom hook to call the API
  const { data, error, loading, execute: fetchPosts } = useApi(fetchAllPosts, true);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  // Ensure we have data and it's an array before mapping
  const posts = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link 
          to="/create-post" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Create New Post
        </Link>
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
    </div>
  );
}