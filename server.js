const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000', // פיתוח מקומי
  'https://portfolio-135c.onrender.com' // האתר שלך ברנדר
];


// Middleware
app.use(cors({
    origin: allowedOrigins
}));
app.use(express.json()); // Parse JSON bodies

const DATA_FILE = './projects.json';

// Helper to read projects from file
function readProjects() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading data:', err);
    return [];
  }
}

// Helper to write projects to file
function writeProjects(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing data:', err);
  }
}

// GET all projects
app.get('/api/projects', (req, res) => {
  const projects = readProjects();
  res.json(projects);
});

// POST a new project
app.post('/api/projects', (req, res) => {
  const projects = readProjects();
  const newProject = req.body;
  newProject.id = projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1;
  projects.push(newProject);
  writeProjects(projects);
  res.status(201).json(newProject);
});

// PUT update project by ID
app.put('/api/projects/:id', (req, res) => {
  const projects = readProjects();
  const id = parseInt(req.params.id);
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }
  projects[index] = { ...projects[index], ...req.body };
  writeProjects(projects);
  res.json(projects[index]);
});

// DELETE project by ID
app.delete('/api/projects/:id', (req, res) => {
  const projects = readProjects();
  const id = parseInt(req.params.id);
  const updatedProjects = projects.filter(p => p.id !== id);
  if (projects.length === updatedProjects.length) {
    return res.status(404).json({ message: 'Project not found' });
  }
  writeProjects(updatedProjects);
  res.status(204).end();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
