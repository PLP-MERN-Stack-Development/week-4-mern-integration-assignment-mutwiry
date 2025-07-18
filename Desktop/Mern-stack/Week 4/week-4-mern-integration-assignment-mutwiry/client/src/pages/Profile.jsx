import React from 'react';
import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/user');
      setPosts(response.data);
    } catch (error) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body1">
            Username: {user.username}
          </Typography>
          <Typography variant="body1">
            Email: {user.email}
          </Typography>
        </Paper>

        <Typography variant="h5" gutterBottom>
          My Posts
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/create-post')}
          sx={{ mb: 3 }}
        >
          Create New Post
        </Button>

        <List>
          {posts.map((post) => (
            <React.Fragment key={post._id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <Box>
                    <Button
                      onClick={() => navigate(`/edit-post/${post._id}`)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleDeletePost(post._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      variant="h6"
                      color="primary"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/posts/${post._id}`)}
                    >
                      {post.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {post.content.substring(0, 150)}...
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default Profile; 