import { useEffect, useState } from "react";
import { getAllPosts } from "../services/api";
import { Link } from "react-router-dom";

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPosts()
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>📝 Blog Posts</h1>
      {posts.length === 0 ? (
        <p>No posts yet!</p>
      ) : (
        posts.map(post => (
          <div key={post._id} style={{ marginBottom: "1rem" }}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}...</p>
            <Link to={`/posts/${post._id}`}>Read More</Link>
          </div>
        ))
      )}
    </div>
  );
}

export default HomePage;
