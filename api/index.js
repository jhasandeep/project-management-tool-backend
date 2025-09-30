// api/index.js
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Project Management API is running!',
    status: 'success',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Basic CRUD endpoints for testing
app.get('/api/projects', (req, res) => {
  res.json({
    message: 'Projects endpoint',
    data: [],
    status: 'success'
  });
});

app.post('/api/projects', (req, res) => {
  res.json({
    message: 'Project created',
    data: req.body,
    status: 'success'
  });
});

// Catch all
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    status: 'error'
  });
});

module.exports = app;
