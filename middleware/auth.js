import jwt from 'jsonwebtoken';

export const authGuard = (req, res, next) => { 
  const token = req.headers['authorization']?.split(' ')[1];   //*  Header is usually in the format "Bearer <token>". Splitting by space and taking [1] extracts just the token part.
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //*  Checks if the token is valid and signed with the correct secret key. If valid, it returns the payload (user info); if not, it throws an error.
    req.user = decoded; //* This attaches the decoded token payload (user info) to the request so later middleware/controllers know which user is making the request.
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' }); //* If the token is invalid or expired, it catches the error and sends a 401 Unauthorized response.
  }
};

//* Guard for Admins:
export const adminGuard = (req, res, next) => {
  if (!req.user?.isAdmin) { //* The ?. prevents an error if req.user is undefined (e.g., if authGuard wasn’t run or token was invalid).
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

//* Guard for Business Users:
export const businessGuard = (req, res, next) => {
  if (!req.user?.isBusiness) {
    return res.status(403).json({ message: 'Business access only' });
  }
  next();
};

//* Guard for Regular Users (non-business, non-admin)
export const regularGuard = (req, res, next) => {
  if (req.user?.isBusiness || req.user?.isAdmin) {
    return res.status(403).json({ message: 'Regular user access only' });
  }
  next();
};
