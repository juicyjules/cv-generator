const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/change-password', authMiddleware, userController.changePassword);
router.delete('/delete-account', authMiddleware, userController.deleteUser);
router.put('/profile', authMiddleware, userController.updateUserProfile);


module.exports = router;
