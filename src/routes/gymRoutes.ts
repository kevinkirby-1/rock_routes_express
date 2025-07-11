import { Router } from "express";
import {
  createGym,
  deleteGym,
  getGymById,
  getGyms,
  updateGym,
} from "../controllers/gymController";
import { protect } from "../middleware/authMiddleware";
const router = Router();

// All routes accesible only to authenticated users
router.use(protect);

// CRUD
router.post("/", createGym);
router.get("/", getGyms);
router.get("/:id", getGymById);
router.put("/:id", updateGym);
router.delete("/:id", deleteGym);

export default router;
