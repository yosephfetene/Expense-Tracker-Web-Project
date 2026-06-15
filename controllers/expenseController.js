const expenseModel = require('../models/expenseModel');
const categoryModel = require('../models/categoryModel');

const buildMonthlyHistory = (monthlyTotals) => {
  return monthlyTotals.map((item, index, allMonths) => {
    const currentTotal = Number(item.total);
    const previousMonth = allMonths[index + 1];
    const previousTotal = previousMonth ? Number(previousMonth.total) : 0;
    const difference = Number((currentTotal - previousTotal).toFixed(2));
    const percent = previousTotal
      ? Math.round((Math.abs(difference) / previousTotal) * 100)
      : null;

    return {
      month: item.month_start.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      total: currentTotal,
      previousTotal,
      difference,
      percent,
      trend: difference >= 0 ? 'up' : 'down',
      sign: difference >= 0 ? '+' : '-',
    };
  });
};

// GET / -> Dashboard with summary stats and recent expenses
const showDashboard = async (req, res, next) => {
  try {
    const expenses = await expenseModel.getAllExpenses();
    const monthlyTotals = await expenseModel.getMonthlyTotals();
    const total = await expenseModel.getTotalAmount();
    const count = await expenseModel.getExpenseCount();
    const recent = expenses.slice(0, 5);
    const monthlyHistory = buildMonthlyHistory(monthlyTotals);

    const currentMonth = monthlyHistory[0] || {
      month: 'This month',
      total: 0,
      difference: 0,
      percent: null,
      trend: 'up',
      sign: '+',
    };
    const lastMonth = monthlyHistory[1] || {
      month: 'Last month',
      total: 0,
      difference: 0,
      percent: null,
      trend: 'up',
      sign: '+',
    };

    res.render('dashboard', {
      title: 'Dashboard',
      total,
      count,
      recent,
      dashboardComparison: {
        currentMonth,
        lastMonth,
      },
      monthlyHistory,
    });
  } catch (err) {
    next(err);
  }
};

// GET /expenses -> List all expenses
const listExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseModel.getAllExpenses();
    const monthlyTotals = await expenseModel.getMonthlyTotals();
    const monthlyHistory = buildMonthlyHistory(monthlyTotals);

    res.render('expenses/index', {
      title: 'Expenses',
      expenses,
      monthlyHistory,
    });
  } catch (err) {
    next(err);
  }
};

// GET /expenses/add -> Show add expense form
const showAddForm = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.render('expenses/add', { title: 'Add Expense', categories });
  } catch (err) {
    next(err);
  }
};

// POST /expenses/add -> Save a new expense
const addExpense = async (req, res, next) => {
  try {
    const { title, amount, expense_date, category_id } = req.body;

    if (!title || !amount || !expense_date) {
      const categories = await categoryModel.getAllCategories();
      return res.status(400).render('expenses/add', {
        title: 'Add Expense',
        categories,
        error: 'Title, amount and date are required.',
      });
    }

    await expenseModel.createExpense(
      title.trim(),
      amount,
      expense_date,
      category_id || null
    );

    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
};

// GET /expenses/edit/:id -> Show edit form for an expense
const showEditForm = async (req, res, next) => {
  try {
    const expense = await expenseModel.getExpenseById(req.params.id);

    if (!expense) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Expense not found.',
      });
    }

    const categories = await categoryModel.getAllCategories();
    res.render('expenses/edit', { title: 'Edit Expense', expense, categories });
  } catch (err) {
    next(err);
  }
};

// POST /expenses/edit/:id -> Update an existing expense
const updateExpense = async (req, res, next) => {
  try {
    const { title, amount, expense_date, category_id } = req.body;

    await expenseModel.updateExpense(
      req.params.id,
      title.trim(),
      amount,
      expense_date,
      category_id || null
    );

    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
};

// POST /expenses/delete/:id -> Delete an expense
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
