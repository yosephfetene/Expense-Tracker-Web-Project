INSERT INTO categories (name) VALUES
  ('Food'),
  ('Transport'),
  ('Utilities'),
  ('Entertainment'),
  ('Other');

INSERT INTO expenses (title, amount, expense_date, category_id) VALUES
  ('Groceries', 45.50, '2026-06-01', (SELECT id FROM categories WHERE name = 'Food')),
  ('Bus Pass', 20.00, '2026-06-02', (SELECT id FROM categories WHERE name = 'Transport')),
  ('Electricity Bill', 60.75, '2026-06-03', (SELECT id FROM categories WHERE name = 'Utilities')),
  ('Movie Night', 15.00, '2026-06-05', (SELECT id FROM categories WHERE name = 'Entertainment')),
  ('Coffee', 4.25, '2026-06-06', (SELECT id FROM categories WHERE name = 'Food'));
