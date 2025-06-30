import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { posts } from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import { useToast } from '../context/ToastContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { formatDistanceToNow } from 'date-fns';

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) {
      setError('No post ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch the main post
      const response = await posts.getPost(id);
      
      if (!response.data) {
        throw new Error('Post not found');
      }
      
      setPost(response.data);
      
      // Fetch related posts if available
      if (response.data.category) {
        fetchRelatedPosts(response.data.category, response.data._id);
      }
      
    } catch (err) {
      console.error('Error fetching post:', err);
      let errorMessage = 'Failed to load post. Please try again later.';
      
      if (err.response?.status === 404 || err.message === 'Post not found') {
        errorMessage = 'The post you\'re looking for doesn\'t exist or has been removed.';
        navigate('/404', { replace: true });
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid post ID';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  const fetchRelatedPosts = async (category, excludeId) => {
    try {
      setRelatedLoading(true);
      const response = await posts.getAll(1, 3, category);
      if (response.data) {
        // Filter out the current post and limit to 3 related posts
        const filtered = response.data
          .filter(p => p._id !== excludeId)
          .slice(0, 3);
        setRelatedPosts(filtered);
      }
    } catch (err) {
      console.error('Error fetching related posts:', err);
      // Don't show error toast for related posts to avoid noise
    } finally {
      setRelatedLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading && !post) {
    return (
      <PageLayout>
        <div className="animate-pulse space-y-6">
          {/* Featured image skeleton */}
          <div className="h-64 w-full bg-gray-200 rounded-lg"></div>
          
          {/* Title skeleton */}
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          
          {/* Meta info skeleton */}
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !post) {
    const errorMessage = error === 'Post not found' || error === 'No post ID provided' 
      ? 'The post you\'re looking for doesn\'t exist or has been removed.' 
      : 'Failed to load post. Please try again later.';
    
    return (
      <PageLayout 
        title={error === 'Post not found' ? 'Post Not Found' : 'Error'}
        subtitle={errorMessage}
      >
        <div className="text-center py-12">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={fetchPost}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.886.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Try Again
            </button>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <ErrorBoundary onReset={fetchPost}>
      <PageLayout>
        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {post.featuredImage && (
            <div className="h-64 w-full overflow-hidden">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          )}
          
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{Math.ceil(post.content.length / 1000)} min read</span>
              </div>
              {post.updatedAt && new Date(post.updatedAt) > new Date(post.createdAt) && (
                <>
                  <span>•</span>
                  <div className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                    Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                  </div>
                </>
              )}
            </div>
            
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-lg text-gray-600 italic mb-6">{post.excerpt}</p>
            )}
            
            <div className="prose max-w-none text-gray-700">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">{paragraph || <br />}</p>
              ))}
            </div>
            
            {(post.tags && post.tags.length > 0) && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to all posts
              </Link>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: post.title,
                        text: post.excerpt || post.content.substring(0, 100),
                        url: window.location.href,
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard!');
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Share this post"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map(relatedPost => (
                <article key={relatedPost._id} className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {relatedPost.featuredImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={relatedPost.featuredImage} 
                        alt={relatedPost.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      <Link to={`/posts/${relatedPost._id}`} className="hover:underline">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedPost.excerpt || relatedPost.content.substring(0, 120)}...
                    </p>
                    <Link 
                      to={`/posts/${relatedPost._id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                    >
                      Read more
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </PageLayout>
    </ErrorBoundary>
  );
};

export default PostPage;
