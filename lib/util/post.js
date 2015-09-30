'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const https = require('https');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (options, postString, cb) {
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
