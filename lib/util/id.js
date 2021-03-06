'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const uuid = require('node-uuid');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.create = function () {
  return uuid.v4();
};
