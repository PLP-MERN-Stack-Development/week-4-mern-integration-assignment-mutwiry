import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const PageLayout = ({ 
  title, 
  subtitle, 
  children, 
  headerAction,
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <Helmet>
        <title>{title} | Blog App</title>
        <meta name="description" content={subtitle} />
      </Helmet>
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {headerAction && (
            <div className="mt-4 sm:mt-0 sm:ml-4">
              {headerAction}
            </div>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

PageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  headerAction: PropTypes.node,
  className: PropTypes.string,
};

export default PageLayout;
