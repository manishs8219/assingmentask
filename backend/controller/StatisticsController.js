import mongoose from "mongoose";
import expensesDb from "../models/expense.js";
import   { vaildObject, success, error }  from '../helpers/helper.js';

// 1️⃣ Get top 3 days with highest spending
export const statisticstopDay = async (req, res) => {
    try {
        const matchStage = req.user.role === 'admin'
        
            ? {}
            : { userId: new mongoose.Types.ObjectId(req.user._id) };

        const topDays = await expensesDb.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { total: -1 } },
            { $limit: 3 }
        ]);

        return success(res, "Top 3 spending days fetched successfully.", topDays);
    } catch (err) {
        return error(res, err);
    }
};

// 2️⃣ Get % change in spending from previous to current month
export const statisticsMonthlyChange = async (req, res) => {
    try {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

        const matchStage = req.user.role === 'admin'
            ? {}
            : { userId: new mongoose.Types.ObjectId(req.user._id) };

        const [prev, curr] = await Promise.all([
            expensesDb.aggregate([
                { $match: { ...matchStage, date: { $gte: twoMonthsAgo, $lt: lastMonth } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            expensesDb.aggregate([
                { $match: { ...matchStage, date: { $gte: lastMonth, $lt: now } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        const prevTotal = prev[0]?.total || 0;
        const currTotal = curr[0]?.total || 0;
        const percentageChange = prevTotal === 0 ? 100 : ((currTotal - prevTotal) / prevTotal) * 100;

        return success(res, "Monthly spending percentage change fetched successfully.", { percentageChange });
    } catch (err) {
        return error(res, err);
    }
};

// 3️⃣ Predict next month's expenditure based on last 3 months
export const statisticsPredictednextMonth = async (req, res) => {
    try {
        const now = new Date();
        const months = [0, 1, 2].map(m => new Date(now.getFullYear(), now.getMonth() - m, 1));

        const matchStage = req.user.role === 'admin'
            ? {}
            : { userId: new mongoose.Types.ObjectId(req.user._id) };

        const totals = await Promise.all(months.map(start => {
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
            return expensesDb.aggregate([
                { $match: { ...matchStage, date: { $gte: start, $lt: end } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
        }));

        const sum = totals.reduce((acc, curr) => acc + (curr[0]?.total || 0), 0);
        const average = sum / 3;

        return success(res, "Predicted next month's expenditure fetched successfully.", { predictedNextMonthExpenditure: average });
    } catch (err) {
        return error(res, err);
    }
};
