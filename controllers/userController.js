import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { name, phone, email, password, image, address, isBusiness } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); //* 10 is the salt rounds and we hash to ensure we do not save it in plain text.

    // Create and save the user
    const user = new User({
      name: {
        first: name.first,
        middle: name.middle || '',
        last: name.last,
      },
      phone,
      email,
      password: hashedPassword,
      image: {
        url: image?.url || '',
        alt: image?.alt || '',
      },
      address,
      isBusiness,
    });

    await user.save();

    // Response: only name and email
    res.status(201).json({
      name: {
        first: user.name.first.toLowerCase(),
        middle: user.name.middle || '',
        last: user.name.last.toLowerCase(),
        _id: user._id,
      },
      email: user.email,
      _id: user._id,
    });
  } catch (err) {
    next(err);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const timeLeft = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60)); // minutes
      return res.status(403).json({ message: `Account locked. Try again in ${timeLeft} minutes` });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      user.failedLoginAttempts += 1;

      // Lock account after 3 failed attempts
      if (user.failedLoginAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await user.save();
        return res.status(403).json({ message: 'Account locked for 24 hours due to multiple failed login attempts' });
      }

      await user.save();
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Successful login → reset counters
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = jwt.sign(
      { _id: user._id, isBusiness: user.isBusiness, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};


// Get all users (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password'); //* new: true returns the updated document.
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};
