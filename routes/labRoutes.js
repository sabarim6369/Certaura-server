const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');

router.post('/addlabs', labController.createLab);
router.get('/labs', labController.getLabs);
module.exports = router;
