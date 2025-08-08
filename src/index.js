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

app.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

app.get('/create-cv', (req, res) => {
  res.render('create-cv');
});

app.get('/edit-cv/:id', (req, res) => {
  res.render('edit-cv', { cvId: req.params.id });
});

app.get('/settings', (req, res) => {
  res.render('settings');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
