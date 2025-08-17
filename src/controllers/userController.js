const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userService.createUser(email, password);
    req.login(user, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging in after registration' });
        }
        return res.status(201).json({ message: 'User created successfully', userId: user.id });
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

const passport = require('passport');

const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            return res.status(401).json({ message: info.message });
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.status(200).json({ message: 'Logged in successfully' });
        });
    })(req, res, next);
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.userId;
  try {
    await userService.changePassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.userId;
  try {
    await userService.deleteUser(userId);
    res.clearCookie('token');
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

module.exports = {
  register,
  login,
  changePassword,
  deleteUser,
};
