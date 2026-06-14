
const pool = require('../config/db');


const getAllExpenses = async () => {
  const result = await pool.query(`
    SELECT expenses.*, categories.name AS category_name
    FROM expenses
    LEFT JOIN categories ON expenses.category_id = categories.id
    ORDER BY expense_date DESC, expenses.id DESC
  `);
  return result.rows;
};


const getExpenseById = async (id) => {
  const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
  return result.rows[0];
};


const createExpense = async (title, amount, expense_date, category_id) => {
  const result = await pool.query(
    `INSERT INTO expenses (title, amount, expense_date, category_id)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, amount, expense_date, category_id]
  );
  return result.rows[0];
};


const updateExpense = async (id, title, amount, expense_date, category_id) => {
  const result = await pool.query(
    `UPDATE expenses
     SET title = $1, amount = $2, expense_date = $3, category_id = $4
     WHERE id = $5 RETURNING *`,
    [title, amount, expense_date, category_id, id]
  );
  return result.rows[0];
};


const deleteExpense = async (id) => {
  await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
};


const getTotalAmount = async () => {
  const result = await pool.query('SELECT COALESCE(SUM(amount), 0) AS total FROM expenses');
  return result.rows[0].total;
};


const getExpenseCount = async () => {
  const result = await pool.query('SELECT COUNT(*) AS count FROM expenses');
  return result.rows[0].count;
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getTotalAmount,
  getExpenseCount,
};
