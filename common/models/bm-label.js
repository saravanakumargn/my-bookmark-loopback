'use strict';

module.exports = function(Bmlabel) {

Bmlabel.validatesUniquenessOf('labelName', {message: 'labelName is not unique'});
Bmlabel.validatesLengthOf('labelName', {max: 25, message: {min: 'Password is too long. Max allowed 25 characters.'}});

  //     Bmlabel.listProjects = function(cb) {
  //         console.log('rrrrrr')
  //   Bmlabel.find({
  //     limit:2
  //   }, cb);
  // };
  // Bmlabel.remoteMethod('listProjects', {
  //   returns: {arg: 'bmlabels', type: 'array'},
  //   http: {path:'/BmLabel', verb: 'get'}
  // });

// Bmlabel.find({limit:2}, function(err, bmlabels) {
//     console.log('tt')
// });
};
