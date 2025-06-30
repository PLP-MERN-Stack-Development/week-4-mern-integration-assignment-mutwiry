import { Link } from 'react-router-dom';

const PostItem = ({ post }) => {
  const excerpt = post.content.substring(0, 150) + '...';
  const postDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link to={`/posts/${post._id}`} className="block group">
      <div className="bg-white overflow-hidden shadow rounded-lg h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">
        {/* Image */}
        <div className="h-48 w-full overflow-hidden">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 flex-grow flex flex-col">
          <div className="flex-grow">
            {/* Categories */}
            <div className="mb-2">
              {post.categories && post.categories.length > 0 ? (
                post.categories.slice(0, 2).map((cat) => (
                  <span key={cat._id} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                    {cat.name}
                  </span>
                ))
              ) : (
                <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                  Uncategorized
                </span>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            
            {/* Excerpt */}
            <p className="mt-3 text-base text-gray-500 line-clamp-3">
              {excerpt}
            </p>
          </div>
          
          {/* Footer */}
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              {/* Placeholder for author image */}
              <span className="inline-block h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {post.author?.name || 'Anonymous'}
              </p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={post.createdAt}>
                  {postDate}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostItem;
