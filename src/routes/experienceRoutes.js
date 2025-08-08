const express = require('express');
const experienceController = require('../controllers/experienceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/cvs/:cvId/experiences', experienceController.createExperience);
router.put('/experiences/:id', experienceController.updateExperience);
router.delete('/experiences/:id', experienceController.deleteExperience);

module.exports = router;
