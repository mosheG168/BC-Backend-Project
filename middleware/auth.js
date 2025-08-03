import jwt from 'jsonwebtoken';

export const authGuard = (req, res, next) => { 
  const token = req.headers['authorization']?.split(' ')[1];   
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' }); 
  }
};

export const adminGuard = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

export const businessGuard = (req, res, next) => {
  if (!req.user?.isBusiness) {
    return res.status(403).json({ message: 'Business access only' });
  }
  next();
};

export const regularGuard = (req, res, next) => {
  if (req.user?.isBusiness || req.user?.isAdmin) {
    return res.status(403).json({ message: 'Regular user access only' });
  }
  next();
};
