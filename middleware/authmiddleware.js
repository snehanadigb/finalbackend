const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];  // Extract token from header

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);  // Invalid token, forbidden
            }
           console.log("hi");

            req.user = user;  // Store decoded user in request for further use
            next();
        });
    } else {
        res.sendStatus(401);  // No token, unauthorized
    }
};

module.exports = authenticateJWT;
