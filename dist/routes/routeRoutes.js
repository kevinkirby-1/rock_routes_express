"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routeController_1 = require("../controllers/routeController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All routes accesible only to authenticated users
router.use(authMiddleware_1.protect);
// CRUD
router.post('/', routeController_1.createRoute);
router.get('/', routeController_1.getRoutes);
router.get('/:id', routeController_1.getRouteById);
router.put('/:id', routeController_1.updateRoute);
router.delete('/:id', routeController_1.deleteRoute);
// Helper Routes
router.put('/:id/log-attempt', routeController_1.logAttempt);
router.put('/:id/toggle-project', routeController_1.toggleProjectStatus);
router.put('/:id/mark-complete', routeController_1.markComplete);
exports.default = router;
