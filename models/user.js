const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    age: { type: Number, min: 0, max: 120 },
    hobbies: [String],
    bio: { type: String },
    userId: { type: String, unique: true, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Required Indexes
userSchema.index({ bio: 'text' }); // Text index for bio search
userSchema.index({ userId: 'hashed' }); // Hashed index for userId
userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // TTL: 30 days

module.exports = mongoose.model('User', userSchema);