var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//db connection starts
var mongoose = require('mongoose');
var db = require('./config/db');

mongoose.set('debug', true);

mongoose.connect(db.url, {
  useNewUrlParser: true
});
// mongoose.set('useCreateIndex', true);

//db connection ends


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({
//   extended: true
// }));

// app.use(methodOverride('X-HTTP-Method-Override'));


//allows below headers
// app.use(function (req, res, next) {
//   var value = '*';

//   if (req.headers.origin) {
//CORS error
//     value = req.headers.origin;
//   }

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', value);

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST,  PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With,content-type,Accept');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });

//including our routes
var usersRouter = require('./app/routes/users');
var metertypesRouter = require('./app/routes/metertypes');

var deptmetersRouter = require('./app/routes/deptmeters');
var metersRouter = require('./app/routes/meters');
var tenantsRouter = require('./app/routes/tenants');
var floorsRouter = require('./app/routes/floors');
var dgsRouter = require('./app/routes/dgs');

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/metertypes', metertypesRouter);

app.use('/deptmeters', deptmetersRouter);
app.use('/meters', metersRouter);
app.use('/tenants', tenantsRouter);
app.use('/floors', floorsRouter);
app.use('/dgs', dgsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// process.on('uncaughtException', function (error) {
//   // if(!error.isOperational)
//   console.log(error)
//   // process(1);
// });

module.exports = app;