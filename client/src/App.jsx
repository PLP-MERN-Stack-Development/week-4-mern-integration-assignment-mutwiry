import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import ErrorBoundary from './components/ErrorBoundary';
import PageLayout from './components/layout/PageLayout';
import { PostCardSkeleton } from './components/ui/Skeleton';
import './App.css';

// Lazy load pages for better performance
const Layout = React.lazy(() => import('./components/Layout'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PostPage = React.lazy(() => import('./pages/PostPage'));
const CreatePostPage = React.lazy(() => import('./pages/CreatePostPage'));
const EditPostPage = React.lazy(() => import('./pages/EditPostPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));

// Loading fallback component
const LoadingFallback = () => (
  <PageLayout>
    <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
      <PostCardSkeleton count={3} />
    </div>
  </PageLayout>
);

// Protected route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route 
                  index 
                  element={
                    <ErrorBoundary>
                      <HomePage />
                    </ErrorBoundary>
                  } 
                />
                <Route 
                  path="posts/:id" 
                  element={
                    <ErrorBoundary>
                      <PostPage />
                    </ErrorBoundary>
                  } 
                />
                
                {/* Authentication routes */}
                <Route 
                  path="login" 
                  element={
                    <ErrorBoundary>
                      <LoginPage />
                    </ErrorBoundary>
                  } 
                />
                <Route 
                  path="register" 
                  element={
                    <ErrorBoundary>
                      <RegisterPage />
                    </ErrorBoundary>
                  } 
                />
                
                {/* Protected routes */}
                <Route 
                  path="posts/create" 
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute>
                        <CreatePostPage />
                      </ProtectedRoute>
                    </ErrorBoundary>
                  } 
                />
                <Route 
                  path="posts/:id/edit" 
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute>
                        <EditPostPage />
                      </ProtectedRoute>
                    </ErrorBoundary>
                  } 
                />

                {/* 404 Not Found */}
                <Route 
                  path="*" 
                  element={
                    <ErrorBoundary>
                      <PageLayout 
                        title="404 - Page Not Found"
                        subtitle="The page you're looking for doesn't exist or has been moved."
                      >
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:p-6 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Page not found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              The page you're looking for doesn't exist or has been moved.
                            </p>
                            <div className="mt-6">
                              <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                                </svg>
                                Go back home
                              </Link>
                            </div>
                          </div>
                        </div>
                      </PageLayout>
                    </ErrorBoundary>
                  } 
                />
                </Route>
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
