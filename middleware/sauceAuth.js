require('dotenv').config();
const DB_SECRET_KEY = process.env.TOKEN_SECRET_KEY;

const jwt = require('jsonwebtoken');
const Sauce = require('../models/Sauce');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, DB_SECRET_KEY);
    const userId = decodedToken.userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (req.body.userId && req.body.userId !== userId) {
              throw 'Non authorized';
            } else {
              next();
            }
          })
        .catch((error) => res.status(500).json({ error }));
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};