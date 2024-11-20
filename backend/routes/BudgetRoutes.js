const express = require("express");
const router = express.Router();
const { saveBudget } = require("../controllers/BudgetController"); // Import the controller function

// Route to save budget data
router.post("/save", saveBudget); // Example: POST /api/budget/save

module.exports = router;
