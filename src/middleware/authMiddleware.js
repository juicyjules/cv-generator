const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    // Passport adds the user to the request object.
    // My old middleware added userId. I will add it here for compatibility with existing code.
    req.userId = req.user.id;
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
};

module.exports = authMiddleware;
