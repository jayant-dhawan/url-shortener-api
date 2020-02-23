var express = require('express');
var router = express.Router();
var passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  res.render('error', { message: "Not Found", error: {
      status: "404",
      stack: ""
  } });
})

/* Handle Login POST */
router.post('/', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error('An Error occurred');
          return next(error);
        }
        req.login(user, { session: false }, async (error) => {
          if (error) return next(error)
          //We don't want to store the sensitive information such as the
          //user password in the token so we pick only the email and id
          const body = { _id: user._id, email: user.email };
          //Sign the JWT token and populate the payload with the user email and id
          const token = jwt.sign({ user: body }, 'top_secret', { expiresIn: '30m' });
          res.cookie('jwt', token, { httpOnly: true, secure: true });
          //Send back the token to the user
          return res.json({ token });
        });
      } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });

module.exports = router;