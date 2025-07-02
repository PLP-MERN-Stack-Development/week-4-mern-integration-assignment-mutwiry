import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../services/postService';
import { format } from 'date-fns';

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-700">Post not found</h2>
        <Link to="/" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Posted on {format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
          {post.updatedAt > post.createdAt && (
            <span className="ml-2">
              (Updated on {format(new Date(post.updatedAt), 'MMMM d, yyyy')})
            </span>
          )}
        </div>
        
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
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
      </header>

      <div className="prose prose-indigo max-w-none">
        <div className="whitespace-pre-line">
          {post.content}
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-gray-200">
        <Link 
          to="/" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          ← Back to all posts
        </Link>
      </div>
    </article>
  );
};

export default PostPage;