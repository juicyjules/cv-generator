const express = require('express');
const cvController = require('../controllers/cvController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', cvController.createCv);
router.get('/', cvController.getCvs);
router.get('/:id', cvController.getCv);
router.get('/:id/pdf', cvController.generatePdf);
router.put('/:id', cvController.updateCv);
router.put('/:id/toggle-public', cvController.togglePublic);
router.delete('/:id', cvController.deleteCv);

module.exports = router;
