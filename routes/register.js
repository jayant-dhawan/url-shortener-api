var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', (req, res) => {
  res.render('error', {
    message: "Not Found", error: {
      status: "404",
      stack: ""
    }
  });
})

/* Handle Request POST */
router.post('/', passport.authenticate('register', { session: false }), async (req, res, next) => {
  res.json({
    message: 'Signup successful',
    user: req.user
  });
});

module.exports = router;