const express = require('express');
const biographyController = require('../controllers/biographyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.put('/:cvId', biographyController.upsertBiography);

module.exports = router;
