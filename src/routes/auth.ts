import express from 'express';
import { googleAuth, googleAuthCallback, signIn, signUp } from '../controller/auth';
const router = express.Router();

router.post('/sign-in', signIn);

router.post('/sign-up', signUp);

// @route   GET /auth/google/callback
router.get('/google', googleAuth);

// @desc    Google auth callback
router.get('/google/callback', ...googleAuthCallback)

export default router;
