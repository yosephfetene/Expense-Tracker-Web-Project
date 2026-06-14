const pool = require('../config/database');

async function findAllWithExpenseCounts() {
  const result = await pool.query(`
    SELECT
      c.id,
      c.name,
      COUNT(e.id)::INTEGER AS expense_count
    FROM categories c
    LEFT JOIN expenses e ON e.category_id = c.id
    GROUP BY c.id, c.name
    ORDER BY LOWER(c.name)
  `);

  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    'SELECT id, name FROM categories WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
}

async function create(name) {
  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
    [name]
  );

  return result.rows[0];
}

async function update(id, name) {
  const result = await pool.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING id, name',
    [name, id]
  );

  return result.rows[0] || null;
}

async function remove(id) {
  const result = await pool.query(
    'DELETE FROM categories WHERE id = $1 RETURNING id',
    [id]
  );

  return result.rowCount > 0;
}

async function countExpenses(id) {
  const result = await pool.query(
    'SELECT COUNT(*)::INTEGER AS count FROM expenses WHERE category_id = $1',
    [id]
  );

  return result.rows[0].count;
}

module.exports = {
  findAllWithExpenseCounts,
  findById,
  create,
  update,
  remove,
  countExpenses,
};
