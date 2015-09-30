'use strict';

const test = require('tape');
const sinon = require('sinon');
const PassThrough = require('stream').PassThrough;

test('API - find :: Happy Path', function (t) {
  t.plan(5);
  let api = require('../../lib/api-client');
  let contactFixture = require('../fixtures/contacts');
  let https = require('https');
  let httpsStub = sinon.stub(https, 'request');
  let res = new PassThrough();
  res.write(JSON.stringify({ result : contactFixture }));
  res.end();
  let req = new PassThrough();
  httpsStub.callsArgWith(1, res).returns(req);

  api.newNutshell({ hostname : 'app01.nutshell.com', username : 'test' }, function (err, nutshell) {
    t.ifError(err, 'did not return an error from newNutshell');
    let args = {
      entity : 'Contacts'
    };
    nutshell.find(args, function (err, results) {
      t.ifError(err, 'did not return an error from find');
      t.ok(results, 'returned something');
      t.equal(Array.isArray(results), true, 'returned an array');
      t.equal(results.length, 2, 'returned two contacts');
    });
  });
});
