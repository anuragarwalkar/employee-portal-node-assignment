import jwt from 'jsonwebtoken';
const { JWT_PRIVATE_KEY: jwtPrivateKey } = process.env as any;
// import moment from 'moment';

export const formatMessage = (username: string, message: string) => {
    return {
        username,
        message,
        time: new Date()
    }
}

export const generateAuthToken = (userId: string, username: string,
    fullName: string, email: string) => {
    return jwt.sign({ user: { username, fullName, email, userId } }, jwtPrivateKey);
}