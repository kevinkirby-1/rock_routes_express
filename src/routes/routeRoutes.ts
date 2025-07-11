import { Router } from 'express';
import {
  createRoute,
  getRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
  logAttempt, 
  toggleProjectStatus, 
  markComplete, 
} from '../controllers/routeController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All routes accesible only to authenticated users
router.use(protect);

// CRUD
router.post('/', createRoute);
router.get('/', getRoutes);
router.get('/:id', getRouteById);
router.put('/:id', updateRoute);
router.delete('/:id', deleteRoute);

// Helper Routes
router.put('/:id/log-attempt', logAttempt);
router.put('/:id/toggle-project', toggleProjectStatus);
router.put('/:id/mark-complete', markComplete);

export default router;