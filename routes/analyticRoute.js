const express = require('express');
const router = express.Router();

const { getUrlAnalytics, getTopicAnalytics, getOverallAnalytics } = require('../controller/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:alias', getUrlAnalytics);
router.get('/topic/:topic', getTopicAnalytics); 
router.get('/overall', authMiddleware, getOverallAnalytics);
module.exports = router;
