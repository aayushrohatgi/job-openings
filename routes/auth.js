const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

router.get('/login', function (req, res, next) {
  res.render('auth/login', { title: 'Login' });
});

router.get('/register', function (req, res, next) {
  res.render('auth/register', { title: 'Employee Registration' });
});

/* Register a new user */
router.post('/register', async function (req, res, next) {
  const user = new User(req.body);
  await user.setHashedPassword();

  user.save((err, savedUser) => {
    if (err) {
      console.log('Error while creating a user: ', err);
    }

    res.render('auth/login', { title: 'Login', error: 'User Registered, please login to continue' });
  });
});

/* Login user */
router.post(
  '/login', (req, res, next) => {
    passport.authenticate('local', { session: false },
      (err, user) => {
        console.log(user);
        if (!user) {
          res.render('auth/login', { title: 'Login', error: 'Invalid username or password' });
        } else {
          req.session.user = user;
          res.redirect('/positions/list')
        }
      })(req, res, next);
  });

router.get('/logout', function (req, res, next) {
  req.session.user = undefined;
  res.render('index', { title: 'Position Openings Portal' });
});

module.exports = router;
