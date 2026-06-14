const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error(err.stack);

  res.status(err.status || 500).render('error', {
    title: 'Error',
    message: err.message || 'Something went wrong on the server.',
  });
};

module.exports = errorHandler;
