var express = require('express');
var router = express.Router();
var passport = require('passport');

/* Handle Request POST */
router.post('/register', passport.authenticate('register', { session: false }), async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
});

module.exports = router;