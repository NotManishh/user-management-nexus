require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('../models/user'); // Note the double dots ..

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection Logic for Serverless
// We check if we are already connected to prevent multiple connections in serverless
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// --- API ROUTES ---

// Create
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Read
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Update
app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// Delete
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// IMPORTANT: Do NOT use app.listen() for Vercel. 
// Vercel handles the server execution.
module.exports = app;