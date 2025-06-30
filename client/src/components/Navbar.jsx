import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const navLinkStyle = ({ isActive }) => ({
    borderBottom: isActive ? '2px solid white' : 'none',
    paddingBottom: '0.25rem',
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <h1 
            onClick={() => navigate('/')}
            className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition-colors"
          >
            Blog App
          </h1>
          <div className="space-x-6 flex items-center">
            <NavLink 
              to="/"
              style={navLinkStyle}
              className="hover:text-blue-200 transition-colors"
            >
              Home
            </NavLink>
            
            {isAuthenticated && (
              <>
                <NavLink 
                  to="/posts/create" 
                  style={navLinkStyle}
                  className="hover:text-blue-200 transition-colors"
                >
                  Create Post
                </NavLink>
                
                {user && (
                  <div className="ml-4 text-sm text-blue-100">
                    Welcome, {user.name}
                  </div>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="ml-4 bg-blue-700 hover:bg-blue-800 px-4 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            
            {!isAuthenticated && !isLoading && (
              <>
                <NavLink 
                  to="/login" 
                  style={navLinkStyle}
                  className="hover:text-blue-200 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  style={navLinkStyle}
                  className="hover:text-blue-200 transition-colors bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
