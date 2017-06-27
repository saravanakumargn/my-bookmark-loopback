'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser = require('body-parser');
var path = require('path');
var nunjucks = require('nunjucks');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var helmet = require('helmet');
var app = module.exports = loopback();
app.middleware('initial', bodyParser.urlencoded({ extended: true }));
// Bootstrap the application, configure models, datasources and middleware.

// app.use(loopback.token({
//     model: app.models.accessToken,
//     // currentUserLiteral: 'me'
// }));

app.use(helmet());

app.use(loopback.token({
    // model: app.models.accessToken,
      cookies: ['authorization'],
  // headers: ['authorization'],
}));
// app.use(loopback.token());
app.use(cookieParser('app'))

// var sess = {
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,  
//   cookie: {}
// }
// app.use(session(sess));

boot(app, __dirname);
app.set('view engine', 'njk');
// must be set to serve views properly when starting the app via `slc run` from
// the project root
app.set('views', path.resolve(__dirname, 'views'));

nunjucks.configure([path.join(__dirname, '/views')], {
  autoescape: true,
  express: app
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
