const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const randomToken = require('random-token').create("url-shortner");

// Nodemailer function to send Verification email

function sendVerificationEmail(email, token) {
  let testAccount = nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'alexandre.homenick@ethereal.email',
      pass: 'yXT4WgSXfJp4BQQSYP'
    }
  });
  let info = transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Verify Email", // Subject line
    text: "Verify your email by clicking the link below", // plain text body
    html: '<a href="http://localhost:5000/verify/' + token + '?email="' + email +'>Click Here</a>' // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
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
      //Save the information provided by the user to the the database
      const user = await User.create({ firstname, lastname, email, passwordHash, token, verified });
      //Send Verification Email
      sendVerificationEmail(email, token);
      //Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }));
}