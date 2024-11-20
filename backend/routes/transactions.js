const express = require("express");
const Transaction = require("../models/Transaction");
const router = express.Router();

// POST: Add income
router.post("/add-income", async (req, res) => {
  try {
    const { amount, type, description, category, date } = req.body;

    if (!amount || !type || type !== "Income") {
      return res.status(400).json({ error: "Invalid income data" });
    }

    const newIncome = new Transaction({
      amount,
      type,
      description: description || "Added via Income Tracker",
      category: category || "Miscellaneous",
      date: date || new Date(),
    });

    await newIncome.save();

    res.status(201).json({ message: "Income added successfully", income: newIncome });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ error: "Failed to add income" });
  }
});

// GET: Fetch all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// POST: Add a new transaction
router.post("/", async (req, res) => {
  const { type, amount, description, category, paymentMethod } = req.body;

  // Validate required fields
  if (!type || !amount || !description || !category || !paymentMethod) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Validate 'type' field
  const validTypes = ["Income", "Expense"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "'type' must be either 'Income' or 'Expense'." });
  }

  // Validate 'paymentMethod' field for expenses
  const validPaymentMethods = ["Cash", "Card"];
  if (type === "Expense" && !validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({ error: "'paymentMethod' must be either 'Cash' or 'Card'." });
  }

  try {
    const newTransaction = new Transaction({
      type,
      amount,
      description,
      category,
      paymentMethod,
      date: new Date(), // Set the current date
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction" });
  }
});

// DELETE: Delete a transaction by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    await transaction.remove();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

module.exports = router;
