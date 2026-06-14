const categoryModel = require('../models/categoryModel');

// GET /categories -> List all categories
const listCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.render('categories/index', { title: 'Categories', categories });
  } catch (err) {
    next(err);
  }
};

// POST /categories/add -> Create a new category
const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (name && name.trim() !== '') {
      await categoryModel.createCategory(name.trim());
    }

    res.redirect('/categories');
  } catch (err) {
    // Handle duplicate category name gracefully (unique constraint)
    if (err.code === '23505') {
      const categories = await categoryModel.getAllCategories();
      return res.status(400).render('categories/index', {
        title: 'Categories',
        categories,
        error: 'That category already exists.',
      });
    }
    next(err);
  }
};

module.exports = {
  listCategories,
  addCategory,
};
