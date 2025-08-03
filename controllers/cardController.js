import Card from '../models/Card.js';

// Get all cards
export const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    next(err);
  }
};

// Get card by ID
export const getCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  } catch (err) {
    next(err);
  }
};

// Get cards created by the logged-in user
export const getMyCards = async (req, res, next) => {
  try {
    const cards = await Card.find({ user_id: req.user._id });
    res.json(cards);
  } catch (err) {
    next(err);
  }
};

// Create a new card (Business users only)
export const createCard = async (req, res, next) => {
  try {
    if (!req.user.isBusiness) {
      return res.status(403).json({ message: 'Only business users can create cards' });
    }
    const { bizNumber, ...cardData } = req.body; // Ignore any manual bizNumber
    const card = new Card({ ...cardData, user_id: req.user._id });
    await card.save();
    res.status(201).json(card);
  } catch (err) {
    next(err);
  }
};

// Update a card (Owner only)
export const updateCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    if (card.user_id.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to edit this card' });
    }

    const { bizNumber, ...updateData } = req.body; // Prevent non-admin from changing bizNumber
    Object.assign(card, updateData);
    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

// Delete a card (Owner or Admin)
export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    if (card.user_id.toString() !== req.user._id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this card' });
    }

    await card.deleteOne();
    res.json({ message: 'Card deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Like or unlike a card
export const toggleLike = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const userId = req.user._id;
    if (card.likes.includes(userId)) {
      card.likes = card.likes.filter((id) => id.toString() !== userId);
    } else {
      card.likes.push(userId);
    }

    await card.save();
    res.json(card);
  } catch (err) {
    next(err);
  }
};

// Admin-only: Change bizNumber
export const changeBizNumber = async (req, res, next) => {
  try {
    const { bizNumber } = req.body;

    const exists = await Card.findOne({ bizNumber });
    if (exists) {
      return res.status(400).json({ message: 'bizNumber already exists' });
    }

    const card = await Card.findById(req.params.id).populate('user_id');
    if (!card) return res.status(404).json({ message: 'Card not found' });

    if (!card.user_id?.isBusiness) {
      return res.status(400).json({ message: 'Only cards of business users can have bizNumber changed' });
    }

    card.bizNumber = bizNumber;
    await card.save();

    res.json({ message: 'bizNumber updated successfully', card });
  } catch (err) {
    next(err);
  }
};
