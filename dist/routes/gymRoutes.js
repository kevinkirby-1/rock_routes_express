"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gymController_1 = require("../controllers/gymController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All routes accesible only to authenticated users
router.use(authMiddleware_1.protect);
// CRUD
router.post("/", gymController_1.createGym);
router.get("/", gymController_1.getGyms);
router.get("/:id", gymController_1.getGymById);
router.put("/:id", gymController_1.updateGym);
router.delete("/:id", gymController_1.deleteGym);
exports.default = router;
