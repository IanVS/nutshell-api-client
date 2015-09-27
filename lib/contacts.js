'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const id = require('./util/id');
const api = require('./api-client');

//------------------------------------------------------------------------------
// Setup
//------------------------------------------------------------------------------

const options = {
  hostname : 'app02.nutshell.com',
  method   : 'POST',
  path     : '/api/v1/json',
  username : 'jim@demo.nutshell.com',
  password : '43c789d483fd76547b1f157e3cf5e580b95b9d8c'
};

const nutshell = api.newNutshell(options);

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function getData(postData, cb) {
  nutshell.post(JSON.stringify(postData), function (err, res, data) {
    if (err) {
      cb(err);
    }
    cb(null, JSON.parse(data));
  });
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

function findFirstHundredEmails(state, cb) {
  let postData;
  if (typeof state === 'function') {
    cb = state;
    state = {};
  }
  if (state.postData) {
    postData = state.postData;
  } else {
    postData = {
      'method' : 'findContacts',
      'params' : {
        'orderBy'       : 'displayName',
        'limit'         : 25,
        'stubResponses' : false
      },
      id : id.create()
    };
  }
  let hundredContacts = state.contacts || [];

  getData(postData, function (err, data) {
    if (err) {
      throw new Error(err);
    }
    Array.prototype.push.apply(hundredContacts, data.result.filter(function (contact) {
      return contact.email;
    }));
    if (hundredContacts.length <= 100) {
      postData.params.page = postData.params.page ? postData.params.page + 1 : 2;
      findFirstHundredEmails({ contacts : hundredContacts, postData }, cb);
    }
    cb(hundredContacts.slice(0, 100));
  });
}

module.exports = {
  findFirstHundredEmails
};
