const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    longUrl: { 
        type: String, 
        required: true 
    },
    shortUrl: { 
        type: String, 
        required: true, 
        unique: true 
    },
    alias: { 
        type: String, 
        unique: true 
    },
    topic: { 
        type: String 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Url', urlSchema);
