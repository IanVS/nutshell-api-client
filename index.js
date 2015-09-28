'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const api = require('./lib/api-client');
const contacts = require('./lib/contacts');

//------------------------------------------------------------------------------
// Setup
//------------------------------------------------------------------------------

let options = {
  method   : 'POST',
  path     : '/api/v1/json',
  username : 'jim@demo.nutshell.com',
  password : '43c789d483fd76547b1f157e3cf5e580b95b9d8c'
};

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

let start = Date.now();
api.newNutshell(options, function (err, nutshell) {
  if (err) {
    console.error(err);
    return;
  }
  let state = { nutshell };
  contacts.findFirstHundredEmails(state, function (err, contacts) {
    if (err) {
      console.error(err);
      return;
    }
    // console.log(contacts.length);
    if (contacts.length >= 100) {
      let contactNames = contacts.map(function (contact) {
        return contact.name.displayName;
      });
      console.log(contactNames);
      console.log(`Retrieved ${contactNames.length} contacts with emails in ${(Date.now() - start) / 1000} seconds`);
    }
  });
});
