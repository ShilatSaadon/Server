// Server.js (Express backend)

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

//Allow Cross-Origin requests
app.use(cors());

//Sample data for portfolio
const sampleData = [
    {id: 1, title: 'Project 1', description: 'Description of project 1'},
    {id: 2, title: 'Project 2', description: 'Description of project 2'}
];

//Route to fetch sample portfolio data
app.get('/api/projects', (req, res) =>{
    res.json(sampleData);
});

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})