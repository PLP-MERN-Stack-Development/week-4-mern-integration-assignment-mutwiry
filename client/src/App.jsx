import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import layout from './components/layout';
import HomePage from './pages/Homepage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<layout />}>
            <Route index element={<HomePage />} />
            <Route path="posts/:id" element={<PostPage />} />
            <Route path="posts/create" element={<CreatePostPage />} />
            <Route path="posts/:id/edit" element={<EditPostPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
