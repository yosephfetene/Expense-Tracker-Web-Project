require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const authController = require('./controllers/authController');
const expenseController = require('./controllers/expenseController');
const errorHandler = require('./middleware/errorMiddleware');
const { requireAuth } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware: parse form data
app.use(express.urlencoded({ extended: true }));

// Middleware: serve static files (css, images)
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-this-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Expose current user to templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Middleware: simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.get('/', authController.showLanding);
app.use('/', authRoutes);
app.get('/dashboard', requireAuth, expenseController.showDashboard);
app.use('/expenses', requireAuth, expenseRoutes);
app.use('/categories', requireAuth, categoryRoutes);

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
