'use strict';

var cookieSession = require('cookie-session')

module.exports = function (server) {
  // Install a `/` route that returns server status
  var router = server
    .loopback
    .Router();
  // router.get('/', server.loopback.status());
  var User = server.models.BmUser;
  var AccessToken = server.models.AccessToken;
  var BmLabel = server.models.BmLabel;

  // var tokenId; var access = server.models.accessToken; router.all('*',
  // function(req, res, next) {   // console.log(req)   // if(tokenId) {   //
  // res.header('Authorization', tokenId);   // } console.log('----all-----') //
  // console.log(res.locals.isAccessable) next(); });
  // router.use(function (req, res, next) {
  //   // if(tokenId) {   res.header('Authorization', tokenId); } console.log(req)
  //   // console.log('-----use----') console.log(res.locals.isAccessable) next();
  //   AccessToken
  //     .findById(req.signedCookies.authorization, function (err, accessResult) {
  //       if (err) {
  //         console.log('err:')
  //         // next(); return next(err);
  //       }
  //       // console.log(req) console.log('---AccessToken------')
  //       if (!accessResult) {
  //         // console.log('no user:')
  //         res.locals.isAccessable = false;
  //         next();
  //       } else {
  //         // console.log(user)  console.log('valid user:')
  //         User.findById(accessResult.userId, (err, userResult) => {
  //           if (err) {
  //             console.log('err:')
  //             next();
  //             // return next(err);
  //           }
  //           // console.log('---User------') console.log(userResult)
  //           res.locals.user = userResult;
  //           res.locals.isAccessable = true;
  //           next();

  //         });
  //         // res.locals.isAccessable = true;      next();
  //       }
  //     });

  //   // if (req.signedCookies) { //  User.findById(req.signedCookies.userId,
  //   // function(err, user) { //         if (err) { //             return next(err);
  //   // //         } //         // if (!user) { //         //     return next(new
  //   // Error('No user with this access token was found.')); //         // } //
  //   //   // var loopbackContext = loopback.getCurrentContext(); //         // if
  //   // (loopbackContext) { //         //     req.accessToken.currentUser = user; //
  //   //        //     loopbackContext.set('currentUser', user); //         // } //
  //   //      next(); //     }); } next();
  // });

  // function isValidUser(userId) {   let isValidUser; }
  // router.use(cookieSession({   name: 'session',   keys: ['key1', 'key2'],   //
  // Cookie Options   maxAge: 24 * 60 * 60 * 1000 // 24 hours }))

  router.get('/', function (req, res) {
    // res.render('pages/home');
    res.send('Hello World!!')
  });

  router.get('/bookmark', function (req, res) {
    // console.log(req.signedCookies) console.log(req) console.log(req.accessToken)
    // console.log(isValidUser(req.signedCookies.authorization));
    // console.log('res.locals.isAccessable '+res.locals.isAccessable)
    if (!res.locals.isAccessable) {
      res.redirect('/login');
    } else {
      res.render('pages/bm-app/bm-main');
      // console.log(res.locals.user);
      // BmLabel.find({
      //   where: {
      //     bmUserId: res.locals.user.id
      //   },
      //   limit: 100
      // }, function (err, labelResults) {
      //   // console.log(labelResults);
      //   res.render('pages/bm-app/bm-main', {labels: labelResults});
      // });

    }
    //    AccessToken.findById(req.signedCookies.authorization, (err, user) => {
    // if (err) {       console.log('err:')         // return next(err);     }
    // if (!user) {       console.log('no user:')       res.redirect('/login');
    // }     else {       console.log(user)        console.log('valid user:')
    // res.render('pages/bm-app', { });     } });
  });
  router.get('/bookmark/category', function (req, res) {
    BmLabel
      .find({
        where: {
          bmUserId: res.locals.user.id
        }
      }, function (err, labelResults) {
        // console.log(labelResults);
        res.render('pages/categories/categories-view', {labels: labelResults});
      });
  });
  router.get('/bookmark/category/new', function (req, res) {
    res.render('pages/categories/categories-form');
  });

  router.post('/bookmark/category/new', function (req, res,next) {
    console.log(req.body.ln)
    console.log(req.body.lc)
    BmLabel.create({
      "labelName": req.body.ln,
      "labelColor": req.body.lc,
      "bmUserId": res.locals.user.id
    }, function (err, labelResults) {
      // console.log(labelResults);
        if (err) {
          console.log(err)
          return next(err);
        }      
      res.redirect('/bookmark/category');
    });
  });

  router.get('/bookmark/category/edit/:id', function (req, res) {
    if (!res.locals.isAccessable) {
      res.redirect('/login');
    } else {
      // console.log(res.locals.user);
      BmLabel
        .findOne({
          where: {
          and: [
            {
              bmUserId: res.locals.user.id
            }, {
              id: req.params.id
            }
          ]
        }
        }, function (err, labelResult) {
          // console.log(labelResult);
          res.render('pages/categories/categories-form', {labels: labelResult});
        });
    }
  });
  router.post('/bookmark/category/edit/:id', function (req, res, next) {
    if (!res.locals.isAccessable) {
      res.redirect('/login');
    } else {
      // console.log(res.locals.user);
      console.log('--')
      BmLabel.upsertWithWhere(
        {
          and: [
            {
              bmUserId: res.locals.user.id
            }, {
              id: req.params.id
            }
          ]
        }
      , {
        "labelName": req.body.ln,
        "labelColor": req.body.lc
      }, function (err, labelResult) {
        if (err) {
          console.log(err)
          return next(err);
        }
        // console.log(labelResult); res.render('pages/categories/categories-form', {
        // labels: labelResult });
        res.redirect('/bookmark/category');
      });
    }
  });
  router.get('/bookmark/category/delete/:id', function (req, res, next) {
      BmLabel.destroyAll(
        {
          and: [
            {
              bmUserId: res.locals.user.id
            }, {
              id: req.params.id
            }
          ]
        }
      ,function (err, labelResult) {
        if (err) {
          console.log(err)
          return next(err);
        }
        // console.log(labelResult); res.render('pages/categories/categories-form', {
        // labels: labelResult });
        res.redirect('/bookmark/category');
      });
  });

  router.get('/login', function (req, res) {
    res.render('pages/login');
  });

  router.post('/login', function (req, res) {
    User
      .login({
        email: req.body.email,
        password: req.body.password
      }, 'user', function (err, token) {
        if (err) {
          if (err.details && err.code === 'LOGIN_FAILED_EMAIL_NOT_VERIFIED') {
            res.render('reponseToTriggerEmail', {
              title: 'Login failed',
              content: err,
              redirectToEmail: '/api/users/' + err.details.userId + '/verify',
              redirectTo: '/',
              redirectToLinkText: 'Click here',
              userId: err.details.userId
            });
          } else {
            res.render('pages/login', {
              title: 'Login failed. Wrong username or password',
              content: err,
              redirectTo: '/',
              redirectToLinkText: 'Please login again'
            });
          }
          return;
        }
        // console.log(req.signedCookies) console.log(token)
        res.cookie('authorization', token.id, {
          signed: req.signedCookies
            ? true
            : false,
          maxAge: 1000 * token.ttl
        });
        res.cookie('userId', token.userId.toString(), {
          signed: req.signedCookies
            ? true
            : false,
          maxAge: 1000 * token.ttl
        });
        // router.use(cookieSession({   name: 'session',   keys: ['key1', 'key2'],   //
        // Cookie Options   maxAge: 24 * 60 * 60 * 1000 // 24 hours }))
        // res.redirect('/app?accessToken=' + token.id);
        // console.log(server.models.accessToken) tokenId = token.id;
        res.redirect('/bookmark');

        // res.render('pages/bm-app', { //login user and render 'home' view   email:
        // req.body.email,   accessToken: token.id,   isAccessable: true });
      });
  });

  //log a user out
  router.get('/logout', function (req, res, next) {
    // console.log('authorization') console.log(req.signedCookies)
    // console.log(req.signedCookies.authorization)

    if (!res.locals.isAccessable) {
      return res.sendStatus(401);
    }
    // if (!req.signedCookies) return res.sendStatus(401);
    User
      .logout(req.signedCookies.authorization, function (err) {
        if (err) 
          return next(err);
        
        // var token = new AccessToken({   id: req.signedCookies.authorization });
        // token.destroy();
        res.redirect('/');
      });
  });
  server.use(router);
};
