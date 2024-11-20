const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction"); // Transaction model


router.post("/", async (req, res) => {
  console.log("Request Body:", req.body); // Log request body for debugging

  const { amount, description, category, paymentMethod } = req.body;

  if (!amount || !description || !category || !paymentMethod) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newExpense = new Transaction({
      type: "Expense",
      amount: parseInt(amount, 10),
      description,
      category,
      paymentMethod, // Add paymentMethod here
      date: new Date(),
    });

    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
});



// GET: Fetch all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Transaction.find({ type: "Expense" }); // Fetch only expenses
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

// DELETE: Delete an expense by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Transaction.findById(id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.remove(); // Delete expense
    res.status(200).json({ message: "Expense deleted successfully!" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

module.exports = router;
