const express = require('express');
const router = express.Router();

const { shortenUrl, redirectToUrl } = require('../controller/urlController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, shortenUrl);
router.get('/:alias', redirectToUrl);
module.exports = router;
