const express = require('express');
const templateController = require('../controllers/templateController');
const authMiddleware = require('../middleware/authMiddleware');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

const router = express.Router();

router.use(authMiddleware, adminAuthMiddleware);

router.get('/', templateController.getTemplates);
router.get('/:id', templateController.getTemplate);
router.post('/', templateController.createTemplate);
router.put('/:id', templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router;
