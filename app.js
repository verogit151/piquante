require('dotenv').config();
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require("helmet");
const session = require('express-session');
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauces');

const path = require('path');

mongoose.connect(DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(helmet());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use(mongoSanitize());

app.use(session({
  secret: 's3Cur3',
  name: 'sessionId',
  cookie: { 
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:3000'
  }
}));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;