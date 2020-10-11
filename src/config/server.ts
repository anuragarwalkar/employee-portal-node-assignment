import express, { Application } from 'express';
import http from 'http';
import auth from '../routes/auth';
import errorLogger from '../middleware/logger';
import mongoDBConnection from '../config/mongoDB';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotEnv from 'dotenv';
import authMiddlware from '../middleware/auth';
import path from 'path';
import passport from 'passport';
import passportOauth from '../config/passport';
import employee from '../routes/employee';
passportOauth(passport);

// Environemt Config
dotEnv.config();

const { JWT_PRIVATE_KEY: jwtPrivateKey, ORIGIN: origin } = process.env;

const app: Application = express();
const server = http.createServer(app);

// To Enable Https
app.enable("trust proxy");


// Calling mongodb conncection method
mongoDBConnection();

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

const port = process.env.PORT || 3000;

// 3rd party cors module
app.use(cors({
  origin,
  credentials:true,
}));

// Read Cookies
app.use(cookieParser());

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Set Static folder
app.use(express.static(path.join(__dirname, '../../public')));

// Authenticating middlware
// ------------- Important -------------------------------------------------------
if(!jwtPrivateKey){
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
};

// Passport Middelware
app.use(passport.initialize());
app.use(passport.session());

// Validate JWT Token on every request
app.use('/api/v1', authMiddlware as any);
// ------------------------------------------------------------------------------

// Auth Routes
app.use('/api/auth', auth);

app.use('/api/v1/employee', employee)

// Error logger
app.use(errorLogger);

export { server, port };