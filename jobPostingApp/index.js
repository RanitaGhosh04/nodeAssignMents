const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for jobs
let jobs = [];
let nextId = 1;

// Routes
// Get all jobs
app.get('/jobs', (req, res) => {
    res.json(jobs);
});

// Create a job
app.post('/jobs', (req, res) => {
    const job = req.body;
    job.id = nextId++;
    jobs.push(job);
    res.status(201).json(job);
});

// Update a job
app.put('/jobs/:id', (req, res) => {
    const jobId = parseInt(req.params.id);
    const updatedJob = req.body;

    const index = jobs.findIndex(job => job.id === jobId);
    if (index !== -1) {
        jobs[index] = { ...jobs[index], ...updatedJob };
        res.json(jobs[index]);
    } else {
        res.status(404).json({ error: `Job with ID ${jobId} not found.` });
    }
});

// Delete a job
app.delete('/jobs/:id', (req, res) => {
    const jobId = parseInt(req.params.id);

    const initialLength = jobs.length;
    jobs = jobs.filter(job => job.id !== jobId);

    if (jobs.length < initialLength) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: `Job with ID ${jobId} not found.` });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
