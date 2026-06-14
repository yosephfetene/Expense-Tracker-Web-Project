const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

const showLanding = (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }

  res.render('landing', {
    title: 'Expense Tracker',
  });
};

const showLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    error: null,
    username: '',
  });
};

const handleLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        error: 'Username and password are required.',
        username: username || '',
      });
    }

    const user = await userModel.getUserByUsername(username);

    if (!user) {
      return res.status(401).render('auth/login', {
        title: 'Login',
        error: 'Invalid username or password.',
        username,
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).render('auth/login', {
        title: 'Login',
        error: 'Invalid username or password.',
        username,
      });
    }

    req.session.user = user.username;
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
};

const showRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Register',
    error: null,
    username: '',
  });
};

const handleRegister = async (req, res, next) => {
  try {
    const { username, password, passwordConfirm } = req.body;

    if (!username || !password || !passwordConfirm) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        error: 'All fields are required.',
        username: username || '',
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        error: 'Passwords do not match.',
        username,
      });
    }

    if (password.length < 6) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        error: 'Password must be at least 6 characters.',
        username,
      });
    }

    const existingUser = await userModel.getUserByUsername(username);

    if (existingUser) {
      return res.status(400).render('auth/register', {
        title: 'Register',
        error: 'That username is already taken.',
        username,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await userModel.createUser(username, passwordHash);

    req.session.user = username;
    res.redirect('/dashboard');
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.redirect('/dashboard');
    }

    res.clearCookie('connect.sid');
    res.redirect('/');
  });
};

module.exports = {
  showLanding,
  showLogin,
  handleLogin,
  showRegister,
  handleRegister,
  logout,
};
