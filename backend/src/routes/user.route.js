import express from 'express'
import userController from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protectRoute);

router.get('/', userController.getRecommendedUsers);

router.get('/friends', userController.getMyFriends);

router.post('/friend-request/:id', userController.sendFriendRequest);
router.put('/friend-request/:id/accept', userController.acceptFriendRequest);
router.put('/friend-request/:id/reject', userController.rejectFriendRequest);


router.get("/friend-requests", userController.getFriendRequests);
router.get("/outgoing-friend-requests", userController.getOutgoingRequests)

export default router;