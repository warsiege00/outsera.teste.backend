const express = require('express');
const ProducerController = require('../controllers/ProducerController');

const router = express.Router();

router.get('/awards/intervals', ProducerController.getProducerAwardIntervals);

module.exports = router; 