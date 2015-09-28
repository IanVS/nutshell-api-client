'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const api = require('./lib/api-client');
const contacts = require('./lib/contacts');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.getFirstHundredContactsWithEmails = function (options, cb) {
  options.method = 'POST';
  options.path = '/api/v1/json';

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
      if (contacts.length >= 100) {
        let contactNames = contacts.map(function (contact) {
          return contact.name.displayName;
        });
        cb(err, contactNames);
      }
    });
  });
};
