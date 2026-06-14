# Expense Tracker Project Documentation

## Overview

This project is a full-stack expense tracker built with:

- `Express` for the web server
- `EJS` for server-rendered views
- `PostgreSQL` for data storage
- `express-session` for login sessions
- `MVC` structure for cleaner separation of concerns

The app lets users register, log in, view a dashboard, manage expenses, and manage categories.

## Main Features

- User registration and login
- Session-based authentication
- Dashboard with total spending, expense count, and recent expenses
- Expense CRUD flow:
  - list expenses
  - add expense
  - edit expense
  - delete expense
- Category management:
  - list categories
  - add categories
- PostgreSQL-backed data storage
- Shared EJS templates and partials

## Tech Stack

- `Node.js`
- `Express`
- `EJS`
- `PostgreSQL`
- `pg`
- `bcryptjs`
- `express-session`
- `dotenv`

## Project Structure

```text
app.js                  Main application entry point
config/db.js            PostgreSQL connection pool
controllers/            Request handlers and page logic
models/                 Database queries
routes/                 Express route definitions
middleware/             Authentication and error handling
views/                  EJS templates
public/                 Static assets such as CSS
db/schema.sql           Database schema
db/seed.sql             Sample seed data
```

## Pages And Routes

### Public auth routes

- `GET /` - Landing page
- `GET /login` - Login form
- `POST /login` - Login submit
- `GET /register` - Registration form
- `POST /register` - Registration submit
- `GET /logout` - Log out the current user

### Protected routes

These routes require authentication:

- `GET /dashboard` - Summary dashboard
- `GET /expenses` - List all expenses
- `GET /expenses/add` - Show add expense form
- `POST /expenses/add` - Create expense
- `GET /expenses/edit/:id` - Show edit expense form
- `POST /expenses/edit/:id` - Update expense
- `POST /expenses/delete/:id` - Delete expense
- `GET /categories` - List categories
- `POST /categories/add` - Create category

## Database Tables

### `users`

Stores user accounts.

Columns:

- `id`
- `username`
- `password_hash`
- `created_at`

### `categories`

Stores expense categories.

Columns:

- `id`
- `name`

### `expenses`

Stores expense records.

Columns:

- `id`
- `title`
- `amount`
- `expense_date`
- `category_id`

`category_id` links each expense to a category.

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Create the PostgreSQL database

Create the database used in your `.env` file.

### 3. Run the schema

```bash
psql -d expense_tracker -f db/schema.sql
```

### 4. Seed sample data

```bash
psql -d expense_tracker -f db/seed.sql
```

### 5. Configure environment variables

Example `.env` values:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASSWORD=postgres
DB_PORT=5432
PORT=3000
SESSION_SECRET=your-secret-key
```

### 6. Start the app

```bash
npm start
```

For development:

```bash
npm run dev
```

## How The App Works

### Authentication

- Users register with a username and password
- Passwords are hashed with `bcryptjs`
- A session is created after login or registration
- Protected routes redirect unauthenticated users back to the auth flow

### Expense Flow

- Expenses are stored in PostgreSQL
- Each expense can optionally belong to a category
- The dashboard shows summary data from the expense table

### Category Flow

- Categories are loaded from the database
- New categories can be added through the category page
- Category names are unique

## Sample Data

The `db/seed.sql` file currently inserts:

- categories such as Food, Transport, Utilities, Entertainment, and Other
- sample expenses like Groceries, Bus Pass, Electricity Bill, and Movie Night

## Notes For Development

- If the server fails with `EADDRINUSE`, port `3000` is already being used.
- If a route throws a callback error, check that the controller exports match the route handler names.
- The app uses server-rendered views, so most UI changes live in the `views/` folder and `public/css/style.css`.

## Entry Point

The app starts from:

- [`app.js`](app.js)

This file wires together:

- route registration
- session middleware
- static assets
- 404 handling
- centralized error handling

