'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const id = require('./util/id');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

function findFirstHundredEmails(state, cb) {
  let postData;
  const limit = 60;
  if (!state.nutshell) {
    cb(new Error('Must provide a nutshell object'));
    return;
  }
  const nutshell = state.nutshell;
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
    if (data.error) {
      console.error(data.error);
      return;
    }
    Array.prototype.push.apply(hundredContacts, data.result.filter(function (contact) {
      return contact.email;
    }));
    if (data.result.length < limit) {
      // Retrieved the last page of data from the api
      cb(null, hundredContacts);
    } else {
      if (hundredContacts.length <= 100) {
        postData.params.page = postData.params.page ? postData.params.page + 1 : 2;
        findFirstHundredEmails({ contacts : hundredContacts, postData, nutshell }, cb);
      }
      cb(null, hundredContacts.slice(0, 100));
    }
  });
}

module.exports = {
  findFirstHundredEmails
};
