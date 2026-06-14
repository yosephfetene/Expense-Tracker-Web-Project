# Expense Tracker

A simple full-stack expense tracker built with **Express**, **EJS**, and **PostgreSQL**, using the MVC (Model-View-Controller) pattern. The UI uses a clean, monochrome (black / white / gray) design.

## Features

- **Dashboard**: total spent, total entries, and a list of recent expenses
- **Expenses**: list, add, edit, and delete expenses
- **Categories**: list and add categories, assign categories to expenses
- EJS **partials** (`header.ejs` / `footer.ejs`) reused across every page
- Express **routing**, **middleware** (logger, form parsing, error handling, 404 handler)
- Full **CRUD** against PostgreSQL via the `pg` library

## Project Structure

```
expense-tracker/
├── app.js                  # Express app entry point
├── config/db.js            # PostgreSQL connection pool
├── models/                 # Database query logic
├── controllers/            # Business logic / request handlers
├── routes/                 # Express routers
├── middleware/             # Error handling middleware
├── views/                  # EJS templates (+ partials)
├── public/css/style.css    # Monochrome styling
└── db/                      # schema.sql + seed.sql
```

## Setup

### 1. Install dependencies

```bash
cd expense-tracker
npm install
```

### 2. Create the PostgreSQL database

Create a database (default name used in `.env` is `expense_tracker`):

```bash
createdb expense_tracker
```

### 3. Run the schema and seed scripts

```bash
psql -d expense_tracker -f db/schema.sql
psql -d expense_tracker -f db/seed.sql
```

### 4. Configure environment variables

Edit `.env` with your PostgreSQL credentials:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASSWORD=postgres
DB_PORT=5432
PORT=3000
```

### 5. Start the server

```bash
npm start
```

Or, with auto-reload during development (requires `nodemon`):

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

## Routes

| Method | Path                  | Description            |
|--------|-----------------------|------------------------|
| GET    | `/`                    | Dashboard              |
| GET    | `/expenses`            | List all expenses      |
| GET    | `/expenses/add`        | Show add expense form  |
| POST   | `/expenses/add`        | Create a new expense   |
| GET    | `/expenses/edit/:id`   | Show edit expense form |
| POST   | `/expenses/edit/:id`   | Update an expense      |
| POST   | `/expenses/delete/:id` | Delete an expense      |
| GET    | `/categories`          | List categories        |
| POST   | `/categories/add`      | Create a new category  |
