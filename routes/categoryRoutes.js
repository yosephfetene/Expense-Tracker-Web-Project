const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

router.get('/', categoryController.listCategories);
router.post('/add', categoryController.addCategory);
router.get('/edit/:id', categoryController.showEditForm);
router.post('/edit/:id', categoryController.updateCategory);
router.post('/delete/:id', categoryController.deleteCategory);

module.exports = router;
