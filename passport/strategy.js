var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
var bcrypt = require('bcrypt');

async function validatePassword(password, passwordHash) {
  var result = false;
  await bcrypt.compare(password, passwordHash)
    .then(response => {
      result = response;
    })
    .catch(error => {
      console.log(error);
    })
  return result;
}

var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies)
  {
    token = req.cookies['jwt'];
  }
  return token;
};

module.exports = function (passport) {

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    async function (username, password, done) {
      // check in mongo if a user with username exists or not
      await User.findOne({ email: username }, async function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log('User Not Found with username ' + username);
          return done(null, false);
        }
        if (await validatePassword(password, user.passwordHash)) {
          return done(null, user);
        }
        return done(null, false);
      })
    }));

  passport.use('jwt', new JWTStrategy({
    //secret we used to sign our JWT
    secretOrKey: 'top_secret',
    //we expect the user to send the token as a query parameter with the name 'jwt'
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor, ExtractJWT.fromHeader('jwt'), ExtractJWT.fromAuthHeaderWithScheme('Token')]) //ExtractJWT.fromHeader('jwt')
  }, async (token, done) => {
    try {
      //Pass the user details to the next middleware
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }));
}