import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching post with ID:', id); // Debug log
      
      const response = await axios.get(`/api/posts/${id}`);
      console.log('Post data:', response.data); // Debug log
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError(error.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to post comments');
        return;
      }

      await axios.post(`/api/posts/${id}/comments`, 
        { content: comment },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setComment('');
      fetchPost(); // Refresh post to get new comment
    } catch (error) {
      console.error('Error posting comment:', error);
      setError(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 4 }}>Post not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
          </Typography>
          {post.featuredImage && (
            <Box sx={{ my: 2 }}>
              <img 
                src={post.featuredImage} 
                alt={post.title}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          )}
          <Typography variant="body1" sx={{ mt: 2 }}>
            {post.content}
          </Typography>
          <Box sx={{ mt: 2 }}>
            {post.tags.map((tag, index) => (
              <Typography
                key={index}
                component="span"
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  mr: 1,
                  fontSize: '0.875rem'
                }}
              >
                {tag}
              </Typography>
            ))}
          </Box>
        </Paper>

        {/* Comments Section */}
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        
        {user ? (
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={submitting}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !comment.trim()}
              >
                Post Comment
              </Button>
            </form>
          </Paper>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please <Button onClick={() => navigate('/login')}>login</Button> to post comments
          </Alert>
        )}

        <List>
          {post.comments.map((comment) => (
            <React.Fragment key={comment._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={comment.author.username}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {comment.content}
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

export default PostDetail; 