const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Income", "Expense"], // Valid transaction types
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true, // Ensure description is provided
    default: "", // Default to an empty string if not specified
  },
  category: {
    type: String,
    required: true, // Ensure category is provided
    default: "", // Default to an empty string if not specified
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card"], // Valid payment methods
    required: function () {
      return this.type === "Expense"; // Required only for Expenses
    },
    default: "", // Default to an empty string
  },
  date: {
    type: Date,
    default: Date.now, // Default to the current date
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
