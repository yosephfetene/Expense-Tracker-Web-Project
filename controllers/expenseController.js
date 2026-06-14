const expenseModel = require('../models/expenseModel');
const categoryModel = require('../models/categoryModel');

const showDashboard = async (req, res, next) => {
  try {
    const [summary, recent] = await Promise.all([
      expenseModel.getSummary(),
      expenseModel.getRecentExpenses(),
    ]);

    res.render('dashboard', {
      title: 'Dashboard',
      total: summary.total,
      count: summary.count,
      recent,
    });
  } catch (err) {
    next(err);
  }
};

const listExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseModel.getAllExpenses();

    res.render('expenses/index', {
      title: 'Expenses',
      expenses,
    });
  } catch (err) {
    next(err);
  }
};

const showAddForm = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();

    res.render('expenses/add', {
      title: 'Add Expense',
      categories,
    });
  } catch (err) {
    next(err);
  }
};

const addExpense = async (req, res, next) => {
  const { title, amount, expense_date, category_id } = req.body;

  if (!title || !amount || !expense_date) {
    try {
      const categories = await categoryModel.getAllCategories();

      return res.status(400).render('expenses/add', {
        title: 'Add Expense',
        categories,
        error: 'Title, amount, and date are required.',
      });
    } catch (err) {
      return next(err);
    }
  }

  try {
    await expenseModel.createExpense({
      title: title.trim(),
      amount,
      expense_date,
      category_id,
    });

    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
};

const showEditForm = async (req, res, next) => {
  try {
    const [expense, categories] = await Promise.all([
      expenseModel.getExpenseById(req.params.id),
      categoryModel.getAllCategories(),
    ]);

    if (!expense) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Expense not found.',
      });
    }

    res.render('expenses/edit', {
      title: 'Edit Expense',
      expense,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

const updateExpense = async (req, res, next) => {
  const { title, amount, expense_date, category_id } = req.body;

  try {
    const expense = await expenseModel.updateExpense(req.params.id, {
      title: title.trim(),
      amount,
      expense_date,
      category_id,
    });

    if (!expense) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Expense not found.',
      });
    }

    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
};

const deleteExpense = async (req, res, next) => {
  try {
    await expenseModel.deleteExpense(req.params.id);
    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  showDashboard,
  listExpenses,
  showAddForm,
  addExpense,
  showEditForm,
  updateExpense,
  deleteExpense,
};
