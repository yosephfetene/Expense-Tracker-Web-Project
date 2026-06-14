require('dotenv').config();
const express = require('express');
const path = require('path');

const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const expenseController = require('./controllers/expenseController');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware: parse form data
app.use(express.urlencoded({ extended: true }));

// Middleware: serve static files (css, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware: simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.get('/', expenseController.showDashboard);
app.use('/expenses', expenseRoutes);
app.use('/categories', categoryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Not Found',
    message: 'The page you are looking for does not exist.',
  });
});

// Centralized error-handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Expense Tracker running at http://localhost:${PORT}`);
});
