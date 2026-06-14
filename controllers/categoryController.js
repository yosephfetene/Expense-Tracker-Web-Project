const categoryModel = require('../models/categoryModel');

const listCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();

    res.render('categories/index', {
      title: 'Categories',
      categories,
    });
  } catch (err) {
    next(err);
  }
};

const addCategory = async (req, res, next) => {
  const name = req.body.name && req.body.name.trim();

  if (!name) {
    try {
      const categories = await categoryModel.getAllCategories();

      return res.status(400).render('categories/index', {
        title: 'Categories',
        categories,
        error: 'Category name is required.',
      });
    } catch (err) {
      return next(err);
    }
  }

  try {
    await categoryModel.createCategory(name);
    res.redirect('/categories');
  } catch (err) {
    if (err.code === '23505') {
      try {
        const categories = await categoryModel.getAllCategories();

        return res.status(400).render('categories/index', {
          title: 'Categories',
          categories,
          error: 'That category already exists.',
        });
      } catch (innerErr) {
        return next(innerErr);
      }
    }

    next(err);
  }
};

module.exports = {
  listCategories,
  addCategory,
};
