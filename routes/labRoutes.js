const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');

router.post('/addlabs', labController.createLab);
router.get('/labs', labController.getLabs);
router.put('/labs/:id', labController.updateLab);     // Edit lab by id
router.delete('/labs/:id', labController.deleteLab);  // Delete lab by id

module.exports = router;
