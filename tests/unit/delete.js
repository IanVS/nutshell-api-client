'use strict';

const test = require('tape');
const contacts = require('../../lib/contacts');
let proxyquire = require('proxyquire');
const contactFixture = require('../fixtures/contacts/hundredEmails');


proxyquire = proxyquire.noCallThru().noPreserveCache();

test('findFirstHundredEmails :: Happy path tests', function (t) {
  t.plan(4);

  let clientStub = {};
  clientStub.newNutshell = function (opt, callback) {
    let api = {
      send(postData, cb) {
        cb(null, contactFixture);
      }
    };
    callback(null, api);
  };
  clientStub.newNutshell({}, function (err, stubbedNutshell) {
    if (err) {
      t.fail(err);
      return;
    }
    let state = { nutshell : stubbedNutshell };
    contacts.findFirstHundredEmails(state, function (err, contacts) {
      if (err) {
        t.fail(err);
        return;
      }
      t.ok(contacts, 'returned something');
      t.equal(Array.isArray(contacts), true, 'returned an array');
      t.equal(contacts.length, 1, 'returned one contact');
      t.equal(contacts[0].id, 557, 'returned contact with email address');
    });
  });
});
