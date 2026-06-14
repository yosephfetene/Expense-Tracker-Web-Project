# Expense Tracker

A simple expense tracker built with Express, EJS, and PostgreSQL. The app uses server-rendered pages for viewing expenses, adding new expenses, editing existing expenses, deleting expenses, and managing categories.

## Features

- Dashboard with total spending, entry count, and recent expenses
- Expense list with category, date, amount, edit, and delete actions
- Add and edit expense forms
- Category list and category creation
- PostgreSQL-backed data storage

## Tech Stack

- Node.js
- Express
- EJS
- PostgreSQL
- pg
- dotenv

## Project Structure

```text
app.js                  Express app entry point
controllers/            Request handlers
models/                 PostgreSQL query logic
routes/                 Route definitions
views/                  EJS templates
public/css/style.css    App styling
db/schema.sql           Database schema
db/seed.sql             Sample data
```

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Create the PostgreSQL database:

```bash
createdb expense_tracker
```

Load the schema and sample data:

```bash
psql -d expense_tracker -f db/schema.sql
psql -d expense_tracker -f db/seed.sql
```

Start the app:

```bash
npm start
```

Open the app:

```text
http://localhost:3000
```

## Environment Variables

```env
DATABASE_URL=postgres://localhost:5432/expense_tracker
PORT=3000
```

Do not commit your real `.env` file. Use `.env.example` as the shared template.

## Main Routes

```text
GET  /                    Dashboard
GET  /expenses            List expenses
GET  /expenses/add        Show add expense form
POST /expenses/add        Create expense
GET  /expenses/edit/:id   Show edit expense form
POST /expenses/edit/:id   Update expense
POST /expenses/delete/:id Delete expense
GET  /categories          List categories
POST /categories/add      Create category
```
