import jwt from 'jsonwebtoken';
const { JWT_PRIVATE_KEY: jwtPrivateKey } = process.env as any;

export const generateAuthToken = (userId: string,
    fullName: string, email: string) => {
    return jwt.sign({ user: { fullName, email, userId } }, jwtPrivateKey);
}