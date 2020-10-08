import { Request, Response, NextFunction } from 'express';
interface CustomError extends Error {
    statusCode: number;
}

const logger = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    const error = {...err};
    error['message'] = err.message;

    const statusCode = error.statusCode || 500;
    const errorMessage =  error.message || 'Server Error';

    res.status(statusCode).json({
        success:false,
        error:errorMessage
    })
}

export default logger;