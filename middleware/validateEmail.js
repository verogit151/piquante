const evalidator = require('express-validator');

module.exports = (req, res, next) => {
    try {
        console.log(req.body.email);
        const isE = req.body.email.isEmail();
        console.log("isE");
        if (req.body.email.isEmail()) next();
        else throw 'Invalid email';
        
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}; 


//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//     const userId = decodedToken.userId;
//     if (req.body.userId && req.body.userId !== userId) {
//       throw 'Invalid user ID';
//     } else {
//       next();
//     }
//   } catch {
//     res.status(401).json({
//       error: new Error('Invalid request!')
//     });
//   }
// };