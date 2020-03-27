var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const db = require('./models/index')
var index = require('./routes/index');
var users = require('./routes/users');
var pens = require('./routes/pens');

var session = require('client-sessions')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');

// postgres connect
db.sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch (error => {
  console.error('Unable to connect to the database:', error);
});

// Use client-session middleware
app.use(session({
  cookieName: 'session',
  secret: '123456789',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  // httpOnly: true,
  // secure: true,
  // ephemeral: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/monaco-editor')));


app.use('/', index);
app.use('/users', users);
app.use('/pens', pens);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
