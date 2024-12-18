require('dotenv').config();
const express = require('express');
const app = express();

const cors = require('cors');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
require("./dbHandler/mongodb")
const authRoutes = require('./routes/authRoute');
const urlRoutes = require('./routes/urlRoute');


app.use(express.json());
app.use(cors());
 
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,  
  max: 100, // Limit each user to 100 requests per hour
  message: 'Too many requests, please try again later.'
});


app.use('/api/shorten', limiter);
app.use('/api/auth', authRoutes);
app.use('/api/shorten', urlRoutes);


const redisClient = redis.createClient();
redisClient.on('connect', () => {
  console.log('Redis connected');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
