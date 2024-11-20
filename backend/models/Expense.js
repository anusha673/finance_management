const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true }, // Amount in ₹
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Transport, Education
  type: { type: String, required: true }, // e.g., Cash, Card
  paymentMethod: { type: String, required: true },
  date: { type: Date, default: Date.now }, // Automatically set date if not provided
});

module.exports = mongoose.model("Expense", expenseSchema);
