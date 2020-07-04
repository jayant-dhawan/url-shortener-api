var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', (req, res) => {
  res.sendStatus(404);
})

/* Handle Request POST */
router.post('/', passport.authenticate('register', { session: false }),(req, res) => {
  console.log(req.user);
  res.json({
    message: req.user.message,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
    verified: req.user.verified
  });
});

module.exports = router;