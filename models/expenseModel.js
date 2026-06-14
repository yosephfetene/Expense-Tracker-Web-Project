const pool = require('../db/pool');

const expenseSelect = `
  SELECT expenses.*, categories.name AS category_name
  FROM expenses
  LEFT JOIN categories ON expenses.category_id = categories.id
`;

const getAllExpenses = async () => {
  const result = await pool.query(`${expenseSelect} ORDER BY expense_date DESC, id DESC`);
  return result.rows;
};

const getRecentExpenses = async (limit = 5) => {
  const result = await pool.query(
    `${expenseSelect} ORDER BY expense_date DESC, id DESC LIMIT $1`,
    [limit]
  );
  return result.rows;
};

const getExpenseById = async (id) => {
  const result = await pool.query(`${expenseSelect} WHERE expenses.id = $1`, [id]);
  return result.rows[0];
};

const getSummary = async () => {
  const result = await pool.query(`
    SELECT
      COALESCE(SUM(amount), 0) AS total,
      COUNT(*)::int AS count
    FROM expenses
  `);

  return result.rows[0];
};

const createExpense = async ({ title, amount, expense_date, category_id }) => {
  const result = await pool.query(
    `
      INSERT INTO expenses (title, amount, expense_date, category_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [title, amount, expense_date, category_id || null]
  );

  return result.rows[0];
};

const updateExpense = async (id, { title, amount, expense_date, category_id }) => {
  const result = await pool.query(
    `
      UPDATE expenses
      SET title = $1,
          amount = $2,
          expense_date = $3,
          category_id = $4
      WHERE id = $5
      RETURNING *
    `,
    [title, amount, expense_date, category_id || null, id]
  );

  return result.rows[0];
};

const deleteExpense = async (id) => {
  await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
};

module.exports = {
  getAllExpenses,
  getRecentExpenses,
  getExpenseById,
  getSummary,
  createExpense,
  updateExpense,
  deleteExpense,
};
