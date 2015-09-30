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
  if (answers.qty) {
    opts.qty = parseInt(answers.qty, 10);
  }
  if (answers.orderBy) {
    opts.orderBy = answers.orderBy;
  }
  if (answers.orderDirection) {
    opts.orderDirection = answers.orderDirection;
  }
  if (answers.filterProp) {
    opts.filter = answers.filterProp;
  }
  index.find(answers.find, opts, function (err, results) {
    if (err) {
      console.error(err);
      return;
    }
    let printout;
    if (answers.find === 'Contacts') {
      printout = results.map(function (result) {
        if (answers.findProp === 'email') {
          return `${result.name.displayName} <${result.email['--primary']}>`;
        } else {
          return result.name.displayName;
        }
      });
    } else {
      printout = results;
    }

    console.log(printout);
    console.log(`Retrieved ${results.length} results in ${(Date.now() - start) / 1000} seconds`);
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
      type    : 'password',
      default : '43c789d483fd76547b1f157e3cf5e580b95b9d8c'
    },
    {
      name    : 'find',
      message : 'What would you like to find?',
      type    : 'list',
      default : 'Contacts',
      choices : [
        'Accounts',
        'AccountTypes',
        'Activities',
        'ActivityTypes',
        'Competitors',
        'Contacts',
        'Delays',
        'Industries',
        'Lead_Outcomes',
        'Leads',
        'Markes',
        'Milestones',
        'Origins',
        'Products',
        'Settings',
        'Sources',
        'Teams',
        'Territories',
        'Timeline',
        'Users'
      ]
    },
    {
      name    : 'qty',
      message : 'How many would you like?',
      default : 50
    },
    {
      name    : 'order',
      message : 'Would you like the results ordered a particular way?',
      type    : 'confirm',
      default : false
    },
    {
      name    : 'orderBy',
      message : 'What would you like to order by?',
      default : null,
      when    : function (answers) {
        return answers.order;
      }
    },
    {
      name    : 'orderDirection',
      message : 'What should be the order direction?',
      type    : 'list',
      default : 'ASC',
      choices : [
        'ASC',
        'DESC'
      ],
      when : function (answers) {
        return answers.order;
      }
    },
    {
      name    : 'filter',
      message : 'Would you only like results containing a particular property?',
      type    : 'confirm',
      default : false
    },
    {
      name    : 'filterProp',
      message : 'What property do you want to filter on?',
      when    : function (answers) {
        return answers.filter;
      }
    }
  ], function (answers) {
    console.log('Collecting results. This may take a few seconds...');
    processAnswers(answers);
  });
}

module.exports = {
  promptUser
};
