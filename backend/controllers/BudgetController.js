const Budget = require("../models/Budget");

const saveBudget = async (req, res) => {
  const { category, amount } = req.body;

  try {
    const budget = new Budget({ category, amount });
    await budget.save();
    res.status(201).send("Budget data saved successfully");
  } catch (error) {
    res.status(500).send("Error saving budget data");
  }
};

module.exports = { saveBudget };
