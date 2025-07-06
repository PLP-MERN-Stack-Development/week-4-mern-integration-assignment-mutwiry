import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import DeletePostPage from './pages/DeletePostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Layout wrapper for all routes that need the layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        
        {/* Post detail route */}
        <Route 
          path="/posts/:id" 
          element={
            <PostPage />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="create-post" 
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="edit-post/:id" 
          element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="delete-post/:id" 
          element={
            <ProtectedRoute>
              <DeletePostPage />
            </ProtectedRoute>
          } 
        />
      </Route>
      
      {/* Redirect to home for any other route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;