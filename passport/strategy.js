var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
var bcrypt = require('bcrypt');

module.exports = function (passport) {

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function (username, password, done) {
      // check in mongo if a user with username exists or not
      User.findOne({ email: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log('User Not Found with username ' + username);
          return done(null, false);
        }
        if (bcrypt.compare(password, user.passwordHash)) {
          return done(null, user);
        }

        return done(null, false);
      })
    }));

  passport.use('jwt', new JWTStrategy({
    //secret we used to sign our JWT
    secretOrKey: 'top_secret',
    //we expect the user to send the token as a query parameter with the name 'jwt'
    jwtFromRequest: ExtractJWT.fromHeader('jwt')
  }, async (token, done) => {
    try {
      //Pass the user details to the next middleware
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }));
}