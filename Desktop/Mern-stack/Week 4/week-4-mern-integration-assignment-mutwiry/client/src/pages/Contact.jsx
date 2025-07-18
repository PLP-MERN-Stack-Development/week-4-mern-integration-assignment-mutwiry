import React from 'react';
import { Container, Typography, Box, Paper, TextField, Button } from '@mui/material';

const Contact = () => (
  <Box sx={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)',
    py: 6
  }}>
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, boxShadow: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
          Have questions, feedback, or want to get in touch? Fill out the form below or email us at <a href="mailto:info@mernblog.com" style={{ color: '#1976d2', textDecoration: 'underline' }}>info@mernblog.com</a>.
        </Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField label="Your Name" variant="outlined" fullWidth required sx={{ bgcolor: 'white', borderRadius: 2 }} />
          <TextField label="Your Email" variant="outlined" fullWidth required type="email" sx={{ bgcolor: 'white', borderRadius: 2 }} />
          <TextField label="Message" variant="outlined" fullWidth required multiline rows={4} sx={{ bgcolor: 'white', borderRadius: 2 }} />
          <Button variant="contained" color="primary" disabled sx={{ mt: 2, borderRadius: 2, fontWeight: 700, fontSize: '1rem' }}>Send (Demo Only)</Button>
        </Box>
      </Paper>
    </Container>
  </Box>
);

export default Contact; 