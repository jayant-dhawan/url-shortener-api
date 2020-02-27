var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const cors = require('cors');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var db = require('./db');
var initPassport = require('./passport/init');

//All the routers
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var verifyRouter = require('./routes/verify');
var shortenRouter = require('./routes/shorten');
var getRedirectsRouter = require('./routes/getRedirects');
var redirectRouter = require('./routes/redirect');
var getClickCountRouter = require('./routes/getClickDetails');

var app = express();

mongoose.connect(db.url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, function(err){
  if (err) console.log(err);
  else console.log("DB Connected");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'url-shortner',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/verify', verifyRouter);
app.use('/shorten', passport.authenticate('jwt', { session: false }), shortenRouter);
app.use('/redirects', passport.authenticate('jwt', { session: false }), getRedirectsRouter);
app.use('/r', redirectRouter);
app.use('/click', passport.authenticate('jwt', { session: false }), getClickCountRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var port = process.env.port || 5000;
app.listen(port);

module.exports = app;
