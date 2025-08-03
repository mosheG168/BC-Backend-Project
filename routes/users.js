import express from 'express';
import {
  register,
  login,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authGuard, adminGuard } from '../middleware/auth.js';
import { validateUser, registerSchema, loginSchema } from '../validators/userValidator.js';

const router = express.Router();

router.post('/', validateUser(registerSchema), register);
router.post('/login', validateUser(loginSchema), login);
router.get('/', authGuard, adminGuard, getAllUsers);
router.get('/:id', authGuard, getUserById);
router.put('/:id', authGuard, updateUser);
router.delete('/:id', authGuard, deleteUser);

export default router;
