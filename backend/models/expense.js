import mongoose from "mongoose"

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    amount: Number,
    date: Date,
    description: String
});
// const expense = mongoose.model('expense', expenseSchema);
export default mongoose.model("expense", expenseSchema);
