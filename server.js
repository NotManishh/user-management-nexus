require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const User = require('./models/user'); // Ensure your file is models/user.js

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// --- DEBUGGING LOGS ---
console.log("-----------------------------------------");
console.log("🚀 Initializing Server...");
console.log("📂 Current Directory:", __dirname);
console.log("🔑 Checking MONGO_URI:", process.env.MONGO_URI ? "Defined ✅" : "UNDEFINED ❌");
console.log("-----------------------------------------");

// Connection URI Logic
const dbURI = process.env.MONGO_URI || 'YOUR_ACTUAL_MONGODB_URI_HERE';

// MongoDB Connection
mongoose.connect(dbURI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
    .catch(err => {
        console.error('❌ Connection error details:');
        console.error(err.message);
    });

// --- API ROUTES ---

// 1. Create User
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (e) {
        console.error("Post Error:", e.message);
        res.status(400).send(e.message);
    }
});

// 2. Read All Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// 3. Update User
app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        res.json(user);
    } catch (e) {
        res.status(400).send(e.message);
    }
});

// 4. Delete User
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User successfully deleted' });
    } catch (e) {
        res.status(500).send(e.message);
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is live at http://localhost:${PORT}`);
});