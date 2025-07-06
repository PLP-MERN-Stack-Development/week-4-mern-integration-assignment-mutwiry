import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

export default function PostItem({ post }) {
  const { _id, title, excerpt, author, createdAt, categories = [], featuredImage, viewCount = 0 } = post;
  
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      {featuredImage && (
        <div className="h-48 overflow-hidden">
          <img 
            src={featuredImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <time dateTime={createdAt}>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </time>
            <span>•</span>
            <span>{viewCount} views</span>
          </div>
          
          <Link to={`/posts/${_id}`} className="block mt-2">
            <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
              {title}
            </h3>
            {excerpt && (
              <p className="mt-3 text-base text-gray-500 line-clamp-3">
                {excerpt}
              </p>
            )}
          </Link>
        </div>
        
        <div className="mt-4 flex items-center">
          <div className="flex-shrink-0">
            <span className="sr-only">{author?.name || 'Unknown Author'}</span>
            {author?.avatar ? (
              <img 
                className="h-10 w-10 rounded-full" 
                src={author.avatar} 
                alt={author.name} 
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {(author?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {author?.name || 'Unknown Author'}
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              {categories?.map(category => (
                <span key={category._id} className="hover:text-gray-600">
                  {category.name}
                </span>
              )).reduce((prev, curr, i) => [prev, <span key={i}>•</span>, curr], [])}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
