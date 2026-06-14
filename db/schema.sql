DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  category_id INT REFERENCES categories(id)
);
