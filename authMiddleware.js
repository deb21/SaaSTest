const jwt = require("jsonwebtoken");

// Middleware to authenticate and verify JWT token
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "Access token missing or invalid" });
  }

  try {
    // Verify the token and populate req.user with decoded data
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_jwt_secret' with your secret key
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;

/*
Integration Steps:
1. Save this code in a new file named `authMiddleware.js`.
2. In your `noteRoutes.js` file, import this middleware:

   const authenticateUser = require('./authMiddleware');

3. Apply this middleware to routes in `noteRoutes.js`:

   router.post('/notes', authenticateUser, async (req, res) => { ... });
   router.get('/notes', authenticateUser, async (req, res) => { ... });
   router.put('/notes/:id', authenticateUser, async (req, res) => { ... });
   router.delete('/notes/:id', authenticateUser, async (req, res) => { ... });
*/
