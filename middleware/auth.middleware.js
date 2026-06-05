const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {

  try {

    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check token exists
    if (!authHeader) {

      return res.status(401).json({
        error: 'Token missing'
      });

    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save user data in request
    req.user = decoded;

    // Continue next function
    next();

  } catch (error) {

    console.log(error);

    res.status(401).json({
      error: 'Invalid token'
    });

  }
};