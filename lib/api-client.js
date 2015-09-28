'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const https = require('https');
const id = require('./util/id');
const async = require('async');

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const endpointDiscoveryHostname = 'api.nutshell.com';
const endpointDiscoveryPath = '/v1/json';
const endpointPath = '/api/v1/json';

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

let post = function (options, postString, cb) {
  let req = https.request(options, function (res) {
    let chunks = [];
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });
    res.on('end', function () {
      let buffer = Buffer.concat(chunks);
      cb(null, res, buffer.toString());
    });
  });
  if (postString) {
    req.write(postString);
  }
  req.end();
};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

function getApiEndpointForUser(username, cb) {
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
}
async.memoize(getApiEndpointForUser);

function newNutshell(opt, callback) {
  async.waterfall([
    function setOptions(cb) {
      let options = {};
      options.method = opt.method || 'POST';
      options.path = opt.path || endpointPath;
      if (!opt.username) {
        cb(new Error('No username provided'));
      }
      if (opt.password) {
        options.auth = `${opt.username}:${opt.password}`;
      }
      if (opt.hostname) {
        options.hostname = opt.hostname;
        cb(null, options);
      } else {
        // Need to hit discovery endpoint to get hostname
        getApiEndpointForUser(opt.username, function (err, hostname) {
          if (err) {
            console.error(err);
            return;
          }
          options.hostname = hostname;
          cb(null, options);
        });
      }
    },

    function setupApi(options, cb) {
      let api = {
        send(postData, cb) {
          postData = postData || {};
          post(options, JSON.stringify(postData), function (err, res, data) {
            if (err) {
              cb(err);
            }
            cb(null, JSON.parse(data));
          });
        }
      };
      cb(null, api);
    }
  ], function (err, api) {   // eslint-disable-line handle-callback-err
    callback(null, api);
  });
}

module.exports = {
  newNutshell,
  getApiEndpointForUser
};
