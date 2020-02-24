var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', (req, res) => {
  res.sendStatus(404);
})

/* Handle Request POST */
router.post('/', passport.authenticate('register', { session: false }), async (req, res, next) => {
  res.json({
    message: 'Signup successful',
    user: req.user
  });
});

module.exports = router;