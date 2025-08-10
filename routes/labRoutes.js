const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');

// Labs
router.post('/labs', labController.createLab);
router.get('/labs', labController.getLabs);
module.exports = router;
