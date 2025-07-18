import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/posts');
        console.log('Posts response:', response.data); // Debug log
        setPosts(response.data.posts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.response?.data?.message || 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        sx={{
          background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
          width: '100vw',
          minHeight: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1
        }}
      >
        <Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          px: 4,
          py: 3,
          borderRadius: 3,
          mb: 4,
          boxShadow: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to the MERN Blog!
          </Typography>
          <Typography variant="body1" align="center" color="inherit" sx={{ mb: 2 }}>
            This is your blog homepage. Here you will see all blog posts once they are created.
          </Typography>
        </Box>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
          width: '100vw',
          minHeight: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          px: 4,
          py: 3,
          borderRadius: 3,
          mb: 4,
          boxShadow: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to the MERN Blog!
          </Typography>
        </Box>
        <Typography color="error" variant="h5" align="center" mt={4}>
          {error}
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
          Please make sure your backend server is running and accessible.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        minHeight: '100vh',
        py: 6
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{
          bgcolor: 'primary.main',
          color: 'white',
          px: { xs: 2, sm: 6 },
          py: { xs: 3, sm: 4 },
          borderRadius: 3,
          mb: 6,
          boxShadow: 3,
          textAlign: 'center'
        }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to the MERN Blog!
          </Typography>
          <Typography variant="body1" align="center" color="inherit" sx={{ mb: 2 }}>
            This is your blog homepage. Here you will see all blog posts once they are created.
          </Typography>
        </Box>
        {posts.length === 0 ? (
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 4 }}>
            No posts yet. Be the first to create one!
          </Typography>
        ) : (
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: 6,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    boxShadow: 12
                  },
                  minHeight: 220
                }}>
                  <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      component={Link} 
                      to={`/posts/${post._id}`}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default Home; 