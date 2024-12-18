const mongoose = require('mongoose');
const analyticsSchema = new mongoose.Schema({
  alias: { 
    type: String, 
    required: true, 
    unique: true 
  },
  totalClicks: { 
    type: Number, 
    default: 0 
  },
  uniqueClicks: { 
    type: Number, 
    default: 0 
  },
  clicksByDate: [{
    date: { 
        type: Date, 
        required: true 
    },
    clickCount: { 
        type: Number, 
        default: 0 
    },
  }],
  osType: [{
    osName: { 
        type: String, 
        required: true 
    },
    uniqueClicks: { 
        type: Number, 
        default: 0 
    },
    uniqueUsers: { 
        type: Number, 
        default: 0 
    },
  }],
  deviceType: [{
    deviceName: { 
        type: String, 
        required: true 
    },
    uniqueClicks: { 
        type: Number, 
        default: 0 
    },
    uniqueUsers: { 
        type: Number, 
        default: 0 
    },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
