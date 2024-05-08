import jwt from "jsonwebtoken";

const getAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1];
  const jwtSecret = process.env.TOKEN_SECRET;

  if (token == null) {
    req.autenticated = false;
    return next()
  }
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      req.autenticated = false;
      return next();
    }
    req.autenticated = true;
    req.userName = user.userName;
    next();
  })
};

const shouldAuthenticate = (req, res, next) => {
  if (req.autenticated) {
    next();
  } else {
    return res.sendStatus(401).json({ message: 'Authentication failed' });
  }
}

export { getAuthenticated, shouldAuthenticate };