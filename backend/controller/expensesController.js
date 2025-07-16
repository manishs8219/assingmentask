import { vaildObject, success, error } from '../helpers/helper.js';
import moment from 'moment';
import ExpenseDb from "../models/expense.js";

// ✅ Add Expense
export const expenses = async (req, res) => {
    try {
        const required = {
            categoryId: req.body.categoryId,
            amount: req.body.amount,
            date: req.body.date,
            description: req.body.description
        };

        const nonRequired = {};

        const getData = await vaildObject(required, nonRequired, res);

        if (!getData) {
            return;
        }

        const expense = await ExpenseDb.create({
            userId: req.user.id,
            categoryId: getData.categoryId,
            amount: getData.amount,
            date: getData.date,
            description: getData.description
        });

        return success(res, "Expense added successfully", expense);
    } catch (err) {
        return error(res, err);
    }
};

// ✅ Get Expense by ID
export const expensesGetByid = async (req, res) => {
    try {
        const expense = await ExpenseDb.findById(req.params.id);

        if (!expense) {
            return error(res, { message: 'Expense not found' });
        }

        if (req.user.role !== 'admin' && expense.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        return success(res, "Expense fetched successfully", expense);
    } catch (err) {
        return error(res, err);
    }
};

// ✅ Delete Expense
export const expensesDelete = async (req, res) => {
    try {
        const expense = await ExpenseDb.findById(req.params.id);

        if (!expense) {
            return error(res, { message: 'Expense not found' });
        }

        if (req.user.role !== 'admin' && expense.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await ExpenseDb.findByIdAndDelete(req.params.id);

        return success(res, "Expense deleted successfully");
    } catch (err) {
        return error(res, err);
    }
};
