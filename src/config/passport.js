const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID || 'YOUR_CLIENT_ID',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
  callbackURL: "http://localhost:3000/auth/linkedin/callback",
  scope: ['r_emailaddress', 'r_liteprofile'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { linkedinId: profile.id } });
    if (existingUser) {
      return done(null, existingUser);
    }

    // This part is tricky. We need to associate the LinkedIn profile with the currently logged-in user.
    // The default behavior of passport is to create a new user.
    // We will need to handle this in the callback route itself.
    // For now, we will just return the profile.
    return done(null, profile);

  } catch (error) {
    return done(error, null);
  }
}));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isValid = await require('../services/userService').verifyPassword(password, user.password);
        if (!isValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

module.exports = passport;
