var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var partials = require('express-partials');
var flash = require('express-flash');
var methodOverride = require('method-override');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// En producción (Heroku) redirijo las peticiones http a https
// Documentación: http://jaketrent.com/post/https-redirect-node-heroku/
if (app.get('env') === 'production') {
  app.use(function(req,res,next) {
    if(req.headers['x-forwarded-proto'] !== 'https') {
      res.redirect('https://' + req.get('Host') + req.url);
    } else {
      next(); /* Continue to other routes if we're not redirecting */
    }
  });
}



// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: "Quiz 2016",
                 resave: false,
                 saveUninitialized: true}));

app.use(methodOverride('_method', {methods: ["POST", "GET"]}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(flash());

// Helper dinámico:
app.use(function(req, res, next) {

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

  next();
});

// Entrega P12: Middleware que para cada petición HTTP recibida realiza 
// estas operaciones:
// Comprobar si el usuario está logueado
// Si lo está, comprobar si la sesión del usuario caducó
// Si ha caducado se destruye la sesión, eliminando la información de login
// Si no ha caducado la sesión, se reinicia el atributo donde se guarda
// cuando caduca la sesión, estableciendo otro período de 2 minutos.

if (app.get('env') === 'production') {
  app.use(function(req,res,next) {
    if (req.headers['x-forwarded-proto'] === 'https'){
      if (req.session.user){
        var currentTime = new Date();
        var userTime = new Date(req.session.user.lastPetition);
        var difference = (currentTime.getTime() - userTime.getTime());
        var timeout = 120000;
        if (difference > timeout){
          delete req.session.user;
          res.redirect('/session');
        } else {
          req.session.user.lastPetition = new Date();
          next(); /* Se pasa a otros MWs si no se redirige */
        }
      } else {
      next();
      } 
    }
  });
}

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
