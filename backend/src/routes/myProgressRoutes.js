const express = require('express');
const { getMyProgress } = require('../controllers/progressController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', protect, getMyProgress);

module.exports = router;
