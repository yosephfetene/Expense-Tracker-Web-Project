const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/', expenseController.listExpenses);
router.get('/add', expenseController.showAddForm);
router.post('/add', expenseController.addExpense);
router.get('/edit/:id', expenseController.showEditForm);
router.post('/edit/:id', expenseController.updateExpense);
router.post('/delete/:id', expenseController.deleteExpense);

module.exports = router;
