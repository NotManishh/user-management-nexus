const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../models/user');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection Logic for Vercel Serverless
if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));
}

// API Routes
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// --- NEW CODE: Serve Frontend ---
// Tell Express where the public folder is located
app.use(express.static(path.join(__dirname, '../public')));

// Explicitly send the index.html when someone visits the root '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});
// --------------------------------

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// For local testing:
if (process.env.NODE_ENV !== 'production') {
    const PORT = 5000;
    app.listen(PORT, () => console.log(`🚀 Local Server: http://localhost:${PORT}`));
}

// Required for Vercel
module.exports = app;