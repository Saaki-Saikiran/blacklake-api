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
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

mongoose.connection.on('open', function (ref) {
  connected = true;
  console.log('open connection to mongo server.');
});

mongoose.connection.on('connected', function (ref) {
  connected = true;
  console.log('connected to mongo server.');
});

mongoose.connection.on('disconnected', function (ref) {
  connected = false;
  console.log('disconnected from mongo server.');
});

mongoose.connection.on('close', function (ref) {
  connected = false;
  console.log('close connection to mongo server');
});

mongoose.connection.on('error', function (err) {
  connected = false;
  console.log('error connection to mongo server!');
  console.log(err);
});

mongoose.connection.on('reconnect', function (ref) {
  connected = true;
  console.log('reconnect to mongo server.');
});

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
app.use(function (req, res, next) {
  var value = '*';

  if (req.headers.origin) {
    //CORS error
    value = req.headers.origin;
  }

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', value);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,  PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With,content-type,Accept');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

//including our routes

//ADMIN MODULE
var usersRouter = require('./app/routes/users');
var metertypesRouter = require('./app/routes/metertypes');
//METER MANAGEMENT MODULE
var deptmetersRouter = require('./app/routes/deptmeters');
var metersRouter = require('./app/routes/meters');
var tenantsRouter = require('./app/routes/tenants');
var floorsRouter = require('./app/routes/floors');
var dgsRouter = require('./app/routes/dgs');
var mapmetertenantRouter = require('./app/routes/mapmetertenant');
//USER MANAGEMENT MODULE
var rolesRouter = require('./app/routes/roles');

//MASTERS
var gatewaymasterRouter = require('./app/routes/gatewaymaster');
var metermasterRouter = require('./app/routes/metermaster');
var meterparamsmasterRouter = require('./app/routes/meterparamsmaster');
var panelmasterRouter = require('./app/routes/panelmaster');
var sourcemasterRouter = require('./app/routes/sourcemaster');

var reportsRouter = require('./app/routes/reports');
// app.use('/', indexRouter);

//ADMIN MODULE
app.use('/users', usersRouter);
app.use('/metertypes', metertypesRouter);

//METER MANAGEMENT MODULE
app.use('/deptmeters', deptmetersRouter);
app.use('/meters', metersRouter);
app.use('/tenants', tenantsRouter);
app.use('/floors', floorsRouter);
app.use('/dgs', dgsRouter);
app.use('/mapmetertenant', mapmetertenantRouter);

//USER MANAGEMENT MODULE
app.use('/roles', rolesRouter);

//master modules
app.use('/sourcemaster', sourcemasterRouter);
app.use('/panelmaster', panelmasterRouter);
app.use('/meterparamsmaster', meterparamsmasterRouter);
app.use('/metermaster', metermasterRouter);
app.use('/gatewaymaster', gatewaymasterRouter);

//REPORTS MODULE
app.use('/reports', reportsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//cron jobs
// var modbusJob = require('./app/jobs/modbus');


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