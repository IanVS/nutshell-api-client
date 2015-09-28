'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const id = require('./util/id');
const api = require('./api-client');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.getApiEndpointForUser = function (username, cb) {
  const options = {
    hostname : 'api.nutshell.com',
    method   : 'POST',
    path     : '/v1/json'
  };
  const nutshell = api.newNutshell(options);
  const postData = {
    method : 'getApiForUsername',
    params : { username },
    id     : id.create()
  };

  nutshell.send(postData, function (err, data) {
    if (err) {
      cb(err);
    }
    cb(null, data.result.api);
  });
};
