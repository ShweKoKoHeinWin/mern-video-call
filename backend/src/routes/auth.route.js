import express from 'express';
import authController from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post("/onboarding", protectRoute, authController.onboard);

router.get('/me', protectRoute, (request, response) => response.status(200).json({success: true, user: request.user}))

export default router;