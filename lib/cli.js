'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const inquirer = require('inquirer');
const index = require('../index');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function processAnswers(answers) {
  let start = Date.now();
  let opts = {
    username : answers.username,
    password : answers.password
  };
  index.getFirstHundredContactsWithEmails(opts, function (err, contacts) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(contacts);
    console.log(`Retrieved ${contacts.length} contacts with emails in ${(Date.now() - start) / 1000} seconds`);
  });
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

function promptUser() {
  inquirer.prompt([
    {
      name    : 'username',
      message : 'What is your username (email)?',
      default : 'jim@demo.nutshell.com'
    },
    {
      name    : 'password',
      message : 'What is your password (API Key)?',
      default : '43c789d483fd76547b1f157e3cf5e580b95b9d8c'
    }
  ], function (answers) {
    console.log('Collecting first 100 contacts with email addresses. This may take a few seconds...');
    processAnswers(answers);
  });
}

module.exports = {
  promptUser
};
