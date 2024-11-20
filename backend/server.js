const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes
const expensesRoutes = require("./routes/expenses"); // Expense-related routes
const transactionsRoutes = require("./routes/transactions"); // Transaction-related routes

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/financeDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Mount routes
app.use("/expenses", expensesRoutes); // Expense-related routes
app.use("/transactions", transactionsRoutes); // Transaction-related routes

// POST: Add a new expense directly (combining both routes if needed)
app.post("/expenses", async (req, res) => {
  const { amount, description, category, type } = req.body;

  // Validation: Ensure required fields are provided
  if (!amount || !description || !category || !type) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Save the expense in the `transactions` collection
    const newExpense = new Transaction({
      type: "Expense", // Mark as an Expense
      amount: parseInt(amount, 10), // Ensure amount is a number
      description,
      category,
      paymentMethod: type, // 'Cash' or 'Card'
      date: new Date(), // Automatically set the current date
    });

    await newExpense.save();
    res.status(201).json(newExpense); // Respond with the saved expense
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ error: "Failed to add expense" });
  }
});

// GET: Fetch all transactions (income and expenses)
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find(); // Fetch all transactions
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
