const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const randomToken = require('random-token').create("url-shortner");

// Nodemailer function to send Verification email

function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    pool: true,
    secure: true,
    host: process.env.HOST,
    port: process.env.PORTSMTP,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });
  transporter.sendMail({
    from: `"URL Shortner api" <${process.env.EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Verify Email", // Subject line
    text: "Verify your email by clicking the link below", // plain text body
    html: '<p>Verify your email by clicking the link below <a href="' + process.env.BASEURL + "verify/" + token + '?email=' + email + '">Click Here</a></p>' // html body
  })
    .then(data => {
      if (messageId) {
        return true;
      } else {
        return false
      }
    })
    .catch(error => { return (false) });
}

module.exports = function (passport) {
  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      //convert password to hash
      const firstname = req.body.firstname;
      const lastname = req.body.lastname;
      const passwordHash = await bcrypt.hash(password, 10);
      //Create random token for verification
      const token = randomToken(16);
      const verified = false;
      let user = {};
      //Save the information provided by the user to the the database
      try {
        user = await User.create({ firstname, lastname, email, passwordHash, token, verified });
        user.message = "Signup Successfull";
        user.status = true;
        //Send Verification Email
        sendVerificationEmail(email, token);
      } catch (error) {
        if (error.code == '11000') {
          user.status = false,
            user.message = "User already exist"
        } else {
          user.status = false,
            user.message = "There is some error"
        }
      }
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }));
}