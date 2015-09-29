'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const api = require('./lib/api-client');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.getFirstHundredContactsWithEmails = function (options, cb) {
  options.method = 'POST';
  options.path = '/api/v1/json';

  api.newNutshell(options, function (err, nutshell) {
    if (err) {
      console.error(err);
      return;
    }
    let args = {
      entity  : 'Contacts',
      qty     : 100,
      filter  : 'email',
      orderBy : 'displayName'
    };
    nutshell.find(args, function (err, results) {
      if (err) {
        console.error(err);
        return;
      }
      cb(null, results);
    });
  });
};
