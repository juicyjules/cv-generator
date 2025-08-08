const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', 'src/views');

const userRoutes = require('./routes/userRoutes');
const cvRoutes = require('./routes/cvRoutes');

app.use('/api/users', userRoutes);
app.use('/api/cvs', cvRoutes);

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

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
