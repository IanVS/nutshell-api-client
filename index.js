'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const api = require('./lib/api-client');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.find = function (entity, args, cb) {
  let options = {
    method   : 'POST',
    path     : '/api/v1/json',
    username : args.username,
    password : args.password
  };

  api.newNutshell(options, function (err, nutshell) {
    if (err) {
      console.error(err);
      return;
    }
    let findArgs = { entity };
    if (args.qty) {
      findArgs.qty = args.qty;
    }
    if (args.orderBy) {
      findArgs.orderBy = args.orderBy;
    }
    if (args.orderDirection) {
      findArgs.orderDirection = args.orderDirection;
    }
    if (args.filter) {
      findArgs.filter = args.filter;
    }
    if (args.query) {
      findArgs.query = args.query;
    }
    nutshell.find(findArgs, function (err, results) {
      if (err) {
        console.error(err);
        return;
      }
      cb(null, results);
    });
  });
};
