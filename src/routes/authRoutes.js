const express = require('express');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

router.get('/linkedin', authMiddleware, (req, res, next) => {
  // Store the logged-in user's ID in the session to associate the LinkedIn profile later.
  req.session.userId = req.userId;
  passport.authenticate('linkedin')(req, res, next);
});

router.get('/linkedin/callback', passport.authenticate('linkedin', {
  failureRedirect: '/settings',
}), async (req, res) => {
  try {
    const linkedinProfile = req.user;
    const userId = req.session.userId;

    if (!userId) {
      // This should not happen if the user is logged in.
      return res.redirect('/settings?error=nouser');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        linkedinId: linkedinProfile.id,
        name: linkedinProfile.displayName,
        photoUrl: linkedinProfile.photos[0].value,
      },
    });

    // Optionally, update the biography with the headline
    // This requires a CV to be selected first.
    // For now, we will just update the user profile.

    res.redirect('/settings?success=linkedin');
  } catch (error) {
    console.error('Error in LinkedIn callback:', error);
    res.redirect('/settings?error=dberror');
  }
});

module.exports = router;
