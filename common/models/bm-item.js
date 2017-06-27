'use strict';

module.exports = function(Bmitem) {
  Bmitem.beforeRemote('create', function(context, user, next) {
      let currentTime = Date.now();
    context.args.data.itemCreatedOn = currentTime;
    context.args.data.itemModifiedOn = currentTime;
    context.args.data.bmUserId = context.req.accessToken.userId;
    next();
  });
};
