// Simple Express API for Vercel
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Basic routes
app.get('/', (req, res) => {
  res.json({
    message: 'Project Management API v1.0',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Project routes (placeholder)
app.get('/api/projects', (req, res) => {
  res.json({
    message: 'Projects endpoint',
    data: [],
    total: 0
  });
});

app.post('/api/projects', (req, res) => {
  res.json({
    message: 'Project created successfully',
    data: req.body,
    id: Date.now()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

module.exports = app;
