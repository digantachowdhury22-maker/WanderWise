import express from 'express';
import { generateTrip, getTrips, getTripById, deleteTrip, toggleFavorite } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateTrip);
router.get('/', protect, getTrips);
router.get('/:id', protect, getTripById);
router.delete('/:id', protect, deleteTrip);
router.patch('/:id/favorite', protect, toggleFavorite);

export default router;
