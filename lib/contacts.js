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
// Public Interface
//------------------------------------------------------------------------------

function findFirstHundredEmails(state, cb) {
  let postData;
  const limit = 25;
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
        'limit'         : limit,
        'stubResponses' : false
      },
      id : id.create()
    };
  }
  let hundredContacts = state.contacts || [];

  nutshell.send(postData, function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    Array.prototype.push.apply(hundredContacts, data.result.filter(function (contact) {
      return contact.email;
    }));
    if (data.result.length < limit) {
      // Retrieved the last page of data from the api
      cb(hundredContacts);
    } else {
      if (hundredContacts.length <= 100) {
        postData.params.page = postData.params.page ? postData.params.page + 1 : 2;
        findFirstHundredEmails({ contacts : hundredContacts, postData }, cb);
      }
      cb(hundredContacts.slice(0, 100));
    }
  });
}

module.exports = {
  findFirstHundredEmails
};
