'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const id = require('./util/id');
const post = require('./util/post');
const async = require('async');

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const endpointDiscoveryHostname = 'api.nutshell.com';
const endpointDiscoveryPath = '/v1/json';

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.getApiEndpointForUser = function (username, cb) {
  const postData = {
    method : 'getApiForUsername',
    params : { username },
    id     : id.create()
  };
  let discoveryOptions = {
    hostname : endpointDiscoveryHostname,
    path     : endpointDiscoveryPath,
    method   : 'POST'
  };
  post(discoveryOptions, JSON.stringify(postData), function (err, res, data) {
    if (err) {
      console.error(err);
      return;
    }
    cb(null, JSON.parse(data).result.api);
  });
};

async.memoize(exports.getApiEndpointForUser);
