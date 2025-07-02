import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../hooks/useApi';
import * as postService from '../services/postService';

export default function HomePage() {
  // Use our custom hook to call the API
  const { data: posts, error, loading, request: fetchPosts } = useApi(postService.getAllPosts);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // fetchPosts is memoized by useCallback in the hook

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
      <Link to="/create-post" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Create New Post
      </Link>
      <div className="grid gap-4">
        {posts && posts.map(post => (
          <div key={post._id} className="p-4 border rounded shadow">
            <h2 className="text-2xl font-semibold">
              <Link to={`/posts/${post._id}`} className="hover:text-indigo-600 hover:underline">{post.title}</Link>
            </h2>
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 mb-2">
                {post.categories.map(category => (
                  <span key={category._id} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                    {category.name}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-2 text-gray-600">
              {post.content.substring(0, 150)}...
              <Link 
                to={`/posts/${post._id}`} 
                className="ml-2 text-indigo-600 hover:underline"
              >
                Read more
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}