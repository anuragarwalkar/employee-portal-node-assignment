import jwt from 'jsonwebtoken';
import ErrorResponse from '../shared/errorResponse';
import { Response, NextFunction } from 'express';
const { JWT_PRIVATE_KEY: jwtPrivateKey } = process.env as any;

interface AuthRequest extends Request {
    cookies : {
        access_token: string;
    },
    header: (type: string) => string,
    user: Object | string;
}

const auth = (req: AuthRequest, res:Response, next:NextFunction): void =>{
    let authHeader = null; 
    let cookieToken = null;
    let token: string = '';

    // Get the Authorization token if provided in header.
    authHeader = req.header('authorization');

    // Get the Access Token if provided in cookies.
    if(req.cookies) cookieToken = req.cookies.access_token;

    // Setting token from header if present.
    if(authHeader) token = authHeader.split(" ")[1];

    // Setting token from cookie if present.
    if(cookieToken) token = cookieToken;

    // If header and cookies are not present.
    if(!authHeader && !cookieToken) {
    return next(new ErrorResponse('Access denied. No token provided.', 401));
    } 

    // Checkig JWT.
    try {
    const decoded = jwt.verify(token, jwtPrivateKey);
    
    // Adding decoded user in request object
    req.user = decoded;
    
    // Allowing if token is valid.
    next();
    } catch (error) {
        return next(new ErrorResponse('Invalid token.', 401));
    }
}

export default auth;