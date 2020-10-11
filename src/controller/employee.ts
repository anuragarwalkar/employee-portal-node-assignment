import { NextFunction, Response, Request } from 'express';
import EmployeeModel from '../models/employee';
import asyncHandler from "../middleware/async";
import ErrorResponse from '../shared/errorResponse';

export const getAllEmployees = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const skip = parseInt(req.query.skip as string);
    const limit = parseInt(req.query.limit as string);

    const data = await EmployeeModel.find().limit(limit * 1).skip((skip - 1) * limit);
    const count = await EmployeeModel.countDocuments();
    
    res.send({ success: true, data: {
        employees: data,
        currentPage: skip ? skip : 0,
        totalPages: Math.ceil(limit ? count / limit : 0),
    } })
});

export const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = await EmployeeModel.findById(id);

    res.send({ success: true, data })
});

export const addNewEmployee = asyncHandler(async (req: Request, res: Response) => {
    const employee = await EmployeeModel.create(req.body);

    res.status(201).send({ success: true, data: employee });
});

export const editEmployeeById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await EmployeeModel.findByIdAndUpdate(id, req.body, { new: true });

    res.status(201).send({ success: true, data });
});

export const deleteEmployeeById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const data = await EmployeeModel.findByIdAndDelete(id);

    if (data === null) return next(new ErrorResponse('Invalid employe id', 400))

    res.status(200).send({ success: true,data: { _id: id, message: 'deleted successfully'} });
});