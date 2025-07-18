import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  Article as ArticleIcon,
  Category as CategoryIcon,
  Comment as CommentIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import AdminLayout from '../layouts/AdminLayout';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
      bgcolor: color || 'primary.main',
      color: 'white'
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography component="h2" variant="h6" gutterBottom>
        {title}
      </Typography>
      {icon}
    </Box>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
  </Paper>
);

const Admin = () => {
  // These would typically come from an API call
  const stats = {
    posts: 25,
    categories: 8,
    comments: 142,
    users: 15
  };

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Posts"
            value={stats.posts}
            icon={<ArticleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Categories"
            value={stats.categories}
            icon={<CategoryIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Comments"
            value={stats.comments}
            icon={<CommentIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Users"
            value={stats.users}
            icon={<PersonIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default Admin; 