'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const contacts = require('./lib/contacts');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

let start = Date.now();
contacts.findFirstHundredEmails(function (contacts) {
  if (contacts.length >= 100) {
    let contactNames = contacts.map(function (contact) {
      return contact.name.displayName;
    });
    console.log(contactNames);
    console.log(`Retrieved ${contactNames.length} contacts with emails in ${(Date.now() - start) / 1000} seconds`);
  }
});
