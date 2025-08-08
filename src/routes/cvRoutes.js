const express = require('express');
const cvController = require('../controllers/cvController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', cvController.createCv);
router.get('/', cvController.getCvs);
router.get('/:id', cvController.getCv);
router.put('/:id', cvController.updateCv);
router.delete('/:id', cvController.deleteCv);

module.exports = router;
