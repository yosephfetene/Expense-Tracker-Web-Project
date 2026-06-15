# Expense Tracker

Expense Tracker is a full-stack web app for managing personal expenses with a clean server-rendered interface. It uses `Express`, `EJS`, and `PostgreSQL` with a simple MVC structure, plus session-based authentication for user accounts.

## What It Does

- User registration and login
- Session-based authentication
- Dashboard with summary stats and recent expenses
- Create, edit, list, and delete expenses
- Create and view categories
- PostgreSQL-backed storage for users, categories, and expenses

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
controllers/            Request handlers
models/                 Database queries
routes/                 Express routes
middleware/             Auth and error middleware
views/                  EJS templates
public/css/style.css    App styling
db/schema.sql           Database schema
db/seed.sql             Sample data
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create the database

Create the PostgreSQL database used by the app.

### 3. Run the schema

```bash
psql -d expense_tracker -f db/schema.sql
```

### 4. Seed sample data (optional)

If you want example expenses for testing, run:

```bash
psql -d expense_tracker -f db/seed.sql
```

> Note: `db/seed.sql` is for local testing only and should not be committed to the repository.

### 5. Configure environment variables

Create a `.env` file in the project root and do not commit it.

Create a `.env` file with values like:

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

For development with auto-reload:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Main Routes

### Public

- `GET /` - Landing page
- `GET /login` - Login form
- `POST /login` - Login submit
- `GET /register` - Registration form
- `POST /register` - Registration submit
- `GET /logout` - Log out

### Protected

These routes require authentication:

- `GET /dashboard` - Summary dashboard
- `GET /expenses` - List all expenses
- `GET /expenses/add` - Add expense form
- `POST /expenses/add` - Create expense
- `GET /expenses/edit/:id` - Edit expense form
- `POST /expenses/edit/:id` - Update expense
- `POST /expenses/delete/:id` - Delete expense
- `GET /categories` - List categories
- `POST /categories/add` - Create category

## Database Tables

### `users`

Stores user accounts.

- `id`
- `username`
- `password_hash`
- `created_at`

### `categories`

Stores expense categories.

- `id`
- `name`

### `expenses`

Stores expense records.

- `id`
- `title`
- `amount`
- `expense_date`
- `category_id`

## How It Works

### Authentication

- Users register with a username and password
- Passwords are hashed before being stored
- A session is created after login or registration
- Protected routes redirect unauthenticated users back to the auth flow

### Expenses

- Expenses are stored in PostgreSQL
- Each expense can be linked to a category
- The dashboard shows total spent, entry count, and recent expenses

### Categories

- Categories are managed from the categories page
- Category names are unique
- Expenses can be assigned to a category when they are created or edited

## Sample Data

The seed file adds example categories and expenses, including:

- Food
- Transport
- Utilities
- Entertainment
- Other

## Notes

- If the app fails to start with `EADDRINUSE`, port `3000` is already in use.
- If a route throws a callback error, check that the controller exports match the route handler names.
- Most UI changes live in the `views/` folder and `public/css/style.css`.

## Documentation

For a more detailed breakdown of the app, see:

- [`DOCUMENTATION.md`](DOCUMENTATION.md)

