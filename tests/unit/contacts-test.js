'use strict';

const test = require('tape');
const contactFixture = require('../fixtures/contacts/hundredEmails');
let proxyquire = require('proxyquire');

proxyquire = proxyquire.noCallThru().noPreserveCache();

test('findFirstHundredEmails :: Happy path tests', function (t) {
  t.plan(4);

  let clientStub = {};
  clientStub.newNutshell = function (opt) {
    let api = {
      send(postData, cb) {
        cb(null, contactFixture);
      }
    };
    return api;
  };
  let stubbedContacts = proxyquire('../../lib/contacts', {
    './api-client' : clientStub
  });

  stubbedContacts.findFirstHundredEmails(function (contacts) {
    t.ok(contacts, 'returned something');
    t.equal(Array.isArray(contacts), true, 'returned an array');
    t.equal(contacts.length, 1, 'returned one contact');
    t.equal(contacts[0].id, 557, 'returned contact with email address');
  });
});
