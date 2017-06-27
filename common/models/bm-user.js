'use strict';

module.exports = function(Bmuser) {
Bmuser.afterRemote('login', function setLoginCookie(context, accessToken, next) {  
    console.log('ddddddd')
    var res = context.res;
    var req = context.req;
    if (accessToken != null) {
        if (accessToken.id != null) {
            res.cookie('access_token', accessToken.id, {
                signed: req.signedCookies ? true : false,
                maxAge: 1000 * accessToken.ttl
            });
            return res.redirect('/');
        }
    }
    return next();
});
};
