const express = require('express');
const educationController = require('../controllers/educationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/cvs/:cvId/educations', educationController.createEducation);
router.put('/educations/:id', educationController.updateEducation);
router.delete('/educations/:id', educationController.deleteEducation);

module.exports = router;
