'use strict';

const test = require('tape');
const api = require('../../lib/api-client');


test('getEndpointForUser :: Happy path test', function (t) {
  t.plan(1);

  api.getApiEndpointForUser('jim@demo.nutshell.com', function (err, result) {
    if (err) {
      t.fail(err);
    }
    t.equal(result, 'app01.nutshell.com', 'retrieved example user\'s endpoint');
  });
});
