import express from 'express';
import { addNewEmployee, deleteEmployeeById, editEmployeeById, getAllEmployees, getEmployeeById } from '../controller/employee';

const router = express.Router();

// Get All Employees
router.get('/', getAllEmployees)

// Add new Employee
router.post('/', addNewEmployee);

// Get All Given Employee
router.get('/:id', getEmployeeById);

// Add new Employee
router.patch('/:id', editEmployeeById);

// Add new Employee
router.delete('/:id', deleteEmployeeById);

export default router;