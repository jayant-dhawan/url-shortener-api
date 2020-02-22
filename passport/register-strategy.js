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
    html: '<a href="http://localhost/verify/' + token + '">Click Here</a>' // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = function (passport) {
  passport.use('register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      //conver password to hash
      const passwordHash = await bcrypt.hash(password, 10);
      //Create random token for verification
      var token = randomToken(16);
      var verified = false;
      //Save the information provided by the user to the the database
      const user = await User.create({ email, passwordHash, token, verified });
      //Send Verification Email
      sendVerificationEmail(email, token);
      //Send the user information to the next middleware
      return done(null, user.username);
    } catch (error) {
      done(error);
    }
  }));
}