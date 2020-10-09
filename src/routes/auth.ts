import express, { NextFunction, Response, Request, CookieOptions } from 'express';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../shared/errorResponse';
import bcrypt from 'bcrypt';
import usersModel from '../models/user';
import passport from 'passport';
import { generateAuthToken } from '../utils/utils';
const {CALLBACK_URL:callbackUrl} = process.env;
// import _ from 'lodash';

const router = express.Router();

router.post('/sign-in', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Object Destructuring request body 
  let { email, password } = req.body;

  // If body does not exist email & password throw error to client.
  if (!email || !password) return next(new ErrorResponse('Invalid email or password', 400));

  // Getting Client Details from collection
  const user: any = await usersModel.findOne({ email });

  if (!user) return next(new ErrorResponse('Invalid email or password', 400));

  // Validating Credentials 
  const validCredentials = await bcrypt.compare(password, user.password);

  // If credentials are not valid throw error to client.
  if (!validCredentials) return next(new ErrorResponse('Invalid password.', 400));

  const userId = user._id.toString();

  // Generating JWT
  const token = generateAuthToken(userId, user.fullName, email);


  const options: CookieOptions = { httpOnly: true };
  const secure = process.env.NODE_ENV !== 'development';

  if (secure) {
    options.sameSite = 'none'
    options.secure = secure;
  }

  res.cookie('access_token', token, options);


  // Sending final response
  res.send(
    {
      success: true, data: {
        user: {
          email: user.email,
          fullName: user.fullName,
          userId: user._id
        },
        token
      }
    });
}));

router.post('/sign-up', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let { password, email, fullName } = req.body;

  if (!password || !email || !fullName) {
    return next(new ErrorResponse('Please send client details', 400));
  }

  // Generating salt to hash a password
  const salt = await bcrypt.genSalt(10)

  // Modifying plain text password to hashed one
  password = await bcrypt.hash(password, salt);

  // Creating client in clients collection
  const clientDetails: any = await usersModel.create({ email, password, fullName });

  // Getting Client details
  const { _id: userId } = clientDetails;

  // Generating JWT
  clientDetails.token = generateAuthToken(userId, fullName, email);

  const options: CookieOptions = { httpOnly: true };
  const secure = process.env.NODE_ENV !== 'development';

  if (secure) {
    options.sameSite = 'none'
    options.secure = secure;
  }

  const { token } = clientDetails;

  // Setting cookie 
  res.cookie('access_token', token, options);

  // Sending final response
  res.status(201).send({ success: true, data: { user: { userId, email, fullName }, token } });
}));

// @route   GET /auth/google/callback
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const options: CookieOptions = { httpOnly: true };
  const secure = process.env.NODE_ENV !== 'development';

  if (secure) {
    options.sameSite = 'none'
    options.secure = secure;
  }

  const { _id: userId, fullName, email } = req.user as any;
  const token = generateAuthToken(userId, fullName, email);

  // Setting cookie 
  res.cookie('access_token', token, options);

  // Redirecting client 
  res.redirect(`${callbackUrl}/auth/?token=${token}`)
})

export default router;
