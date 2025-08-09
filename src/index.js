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
app.use('/api', require('./routes/skillRoutes'));
app.use('/api', require('./routes/projectRoutes'));
app.use('/api', require('./routes/educationRoutes'));
app.use('/api', require('./routes/experienceRoutes'));
app.use('/auth', authRoutes);

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  req.session.destroy(() => {
    res.redirect('/');
  });
});

app.get('/cv/:publicId', cvController.getPublicCv);

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

app.get('/register', (req, res) => {
  res.render('register', { user: req.user });
});

app.get('/welcome', (req, res) => {
  res.render('welcome', { user: req.user });
});

app.get('/dashboard', require('./middleware/authMiddleware'), async (req, res) => {
  const templates = await prisma.template.findMany();
  res.render('dashboard', { user: req.user, templates });
});

app.get('/create-cv', require('./middleware/authMiddleware'), (req, res) => {
  res.render('create-cv', { user: req.user });
});

app.get('/edit-cv/:id', require('./middleware/authMiddleware'), (req, res) => {
  res.render('edit-cv', { user: req.user, cvId: req.params.id });
});

app.get('/settings', require('./middleware/authMiddleware'), (req, res) => {
  res.render('settings', { user: req.user });
});

app.get('/admin', require('./middleware/authMiddleware'), adminAuthMiddleware, (req, res) => {
  res.render('admin', { user: req.user });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
