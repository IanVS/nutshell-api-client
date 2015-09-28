'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const https = require('https');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.newNutshell = function (opt) {
  let hostname = opt.hostname;
  let method = opt.method || 'POST';
  let path = opt.path || '/api/v1/json';
  let auth = `${opt.username}:${opt.password}`;
  let options = {
    hostname,
    method,
    path,
    auth
  };

  let post = function (postString, cb) {
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

  let api = {
    send(postData, cb) {
      postData = postData || {};
      post(JSON.stringify(postData), function (err, res, data) {
        if (err) {
          cb(err);
        }
        cb(null, JSON.parse(data));
      });
    }
  };

  return api;
};
