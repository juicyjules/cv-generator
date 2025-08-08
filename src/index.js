require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', 'src/views');

const userRoutes = require('./routes/userRoutes');
const cvRoutes = require('./routes/cvRoutes');
const biographyRoutes = require('./routes/biographyRoutes');
const cvController = require('./controllers/cvController');
const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/cvs', cvRoutes);
app.use('/api/biography', biographyRoutes);
app.use('/api/templates', require('./routes/templateRoutes'));
app.use('/auth', authRoutes);

app.get('/cv/:publicId', cvController.getPublicCv);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/welcome', (req, res) => {
  res.render('welcome');
});

app.get('/dashboard', require('./middleware/authMiddleware'), async (req, res) => {
  const templates = await prisma.template.findMany();
  res.render('dashboard', { templates });
});

app.get('/create-cv', (req, res) => {
  res.render('create-cv');
});

app.get('/edit-cv/:id', (req, res) => {
  res.render('edit-cv', { cvId: req.params.id });
});

const adminAuthMiddleware = require('./middleware/adminAuthMiddleware');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/settings', require('./middleware/authMiddleware'), async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.render('settings', { user });
});

app.get('/admin', require('./middleware/authMiddleware'), adminAuthMiddleware, (req, res) => {
  res.render('admin');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
