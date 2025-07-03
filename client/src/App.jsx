import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import DeletePostPage from './pages/DeletePostPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="posts/:id" element={<PostPage />} />
          <Route path="create-post" element={<CreatePostPage />} />
          <Route path="edit-post/:id" element={<EditPostPage />} />
          <Route path="delete-post/:id" element={<DeletePostPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;