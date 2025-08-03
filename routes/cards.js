import express from 'express';
import {
  getCards,
  createCard,
  getCardById,
  getMyCards,
  updateCard,
  deleteCard,
  toggleLike,
  changeBizNumber
} from '../controllers/cardController.js';
import { authGuard, adminGuard, businessGuard } from '../middleware/auth.js';
import { validateCard, validateBizNumber } from '../validators/cardValidator.js';

const router = express.Router();

router.get('/', getCards);
router.get('/my-cards', authGuard, getMyCards);
router.patch('/:id/biz-number', authGuard, adminGuard, validateBizNumber, changeBizNumber);
router.get('/:id', getCardById);
router.post('/', authGuard, businessGuard, validateCard, createCard);
router.put('/:id', authGuard, businessGuard, validateCard, updateCard);
router.patch('/:id', authGuard, toggleLike);
router.delete('/:id', authGuard, deleteCard);

export default router;
