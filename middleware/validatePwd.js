const passwordSchema = require('../models/Password');

module.exports = (req, res, next) => {
    try {
        if (!passwordSchema.validate(req.body.password)) {
            throw 'Le mot de passe n\'est pas valide';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}; 