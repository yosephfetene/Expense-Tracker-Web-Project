const categoryModel = require('../models/categoryModel');

function normalizeName(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function validateName(name) {
  if (!name) return 'Category name is required.';
  if (name.length > 50) return 'Category name must be 50 characters or fewer.';
  return null;
}

function isValidId(value) {
  return /^\d+$/.test(value) && Number(value) > 0;
}

function databaseMessage(error) {
  if (error.code === '23505') return 'A category with that name already exists.';
  return null;
}

async function listCategories(req, res, next) {
  try {
    const categories = await categoryModel.findAllWithExpenseCounts();

    res.render('categories/index', {
      title: 'Categories',
      categories,
      success: req.query.success || '',
      error: req.query.error || '',
    });
  } catch (error) {
    next(error);
  }
}

async function addCategory(req, res, next) {
  const name = normalizeName(req.body.name);
  const validationError = validateName(name);

  if (validationError) {
    return res.redirect(`/categories?error=${encodeURIComponent(validationError)}`);
  }

  try {
    await categoryModel.create(name);
    return res.redirect('/categories?success=Category added successfully.');
  } catch (error) {
    const message = databaseMessage(error);
    if (message) return res.redirect(`/categories?error=${encodeURIComponent(message)}`);
    return next(error);
  }
}

async function showEditForm(req, res, next) {
  if (!isValidId(req.params.id)) {
    return res.status(400).render('error', {
      title: 'Invalid Category',
      message: 'The category ID must be a positive number.',
    });
  }

  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).render('error', {
        title: 'Category Not Found',
        message: 'The requested category does not exist.',
      });
    }

    return res.render('categories/edit', {
      title: 'Edit Category',
      category,
      error: '',
    });
  } catch (error) {
    return next(error);
  }
}

async function updateCategory(req, res, next) {
  if (!isValidId(req.params.id)) {
    return res.status(400).render('error', {
      title: 'Invalid Category',
      message: 'The category ID must be a positive number.',
    });
  }

  const name = normalizeName(req.body.name);
  const validationError = validateName(name);

  if (validationError) {
    return res.status(400).render('categories/edit', {
      title: 'Edit Category',
      category: { id: req.params.id, name },
      error: validationError,
    });
  }

  try {
    const category = await categoryModel.update(req.params.id, name);
    if (!category) {
      return res.status(404).render('error', {
        title: 'Category Not Found',
        message: 'The requested category does not exist.',
      });
    }

    return res.redirect('/categories?success=Category updated successfully.');
  } catch (error) {
    const message = databaseMessage(error);
    if (message) {
      return res.status(409).render('categories/edit', {
        title: 'Edit Category',
        category: { id: req.params.id, name },
        error: message,
      });
    }
    return next(error);
  }
}

async function deleteCategory(req, res, next) {
  if (!isValidId(req.params.id)) {
    return res.redirect('/categories?error=Invalid category ID.');
  }

  try {
    const expenseCount = await categoryModel.countExpenses(req.params.id);
    if (expenseCount > 0) {
      const message = `Cannot delete this category because it is used by ${expenseCount} expense(s).`;
      return res.redirect(`/categories?error=${encodeURIComponent(message)}`);
    }

    const deleted = await categoryModel.remove(req.params.id);
    if (!deleted) {
      return res.redirect('/categories?error=Category not found.');
    }

    return res.redirect('/categories?success=Category deleted successfully.');
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listCategories,
  addCategory,
  showEditForm,
  updateCategory,
  deleteCategory,
};
