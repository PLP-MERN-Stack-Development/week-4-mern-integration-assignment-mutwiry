import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const About = () => (
  <Box sx={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)',
    py: 6
  }}>
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>About This Blog</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Welcome to the <b>MERN Blog</b>! This platform is built with the MERN stack (MongoDB, Express, React, Node.js) and is designed for sharing knowledge, tutorials, and stories.
        </Typography>
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Features:</Typography>
        <List>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Modern, responsive design" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Secure authentication and user roles" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Admin dashboard for managing posts and categories" />
          </ListItem>
          <ListItem>
            <ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon>
            <ListItemText primary="Commenting system for user engagement" />
          </ListItem>
        </List>
        <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Our Mission:</Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          To provide a simple, open platform for learning and sharing ideas in web development and beyond.
        </Typography>
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <InfoIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Created for learning and sharing knowledge. Enjoy exploring the posts!
          </Typography>
        </Box>
      </Paper>
    </Container>
  </Box>
);

export default About; 