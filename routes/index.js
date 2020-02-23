var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'URL Shorten API' });
});

router.get('/profile', passport.authenticate('jwt', { session : false }), (req, res, next) => {
  //We'll just send back the user details and the token
  res.json({
    message : 'You made it to the secure route',
    user : req.user,
    token : req.query.secret_token
  })
});



module.exports = router;
