'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------

const id = require('./util/id');
const post = require('./util/post');
const async = require('async');
const endpoint = require('./endpoint');

//------------------------------------------------------------------------------
// Data
//------------------------------------------------------------------------------

const endpointPath = '/api/v1/json';

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

exports.newNutshell = function (opt, callback) {
  async.waterfall([
    function setOptions(cb) {
      let options = {};
      options.method = opt.method || 'POST';
      options.path = opt.path || endpointPath;
      if (!opt.username) {
        cb(new Error('No username provided'));
      }
      if (opt.password) {
        options.auth = `${opt.username}:${opt.password}`;
      }
      if (opt.hostname) {
        options.hostname = opt.hostname;
        cb(null, options);
      } else {
        // Need to hit discovery endpoint to get hostname
        endpoint.getApiEndpointForUser(opt.username, function (err, hostname) {
          if (err) {
            console.error(err);
            return;
          }
          options.hostname = hostname;
          cb(null, options);
        });
      }
    },

    function setupApi(options, cb) {
      let api = {
        send(postData, cb) {
          postData = postData || {};
          post(options, JSON.stringify(postData), function (err, res, data) {
            if (err) {
              cb(err);
            }
            cb(null, JSON.parse(data));
          });
        },

        /**
         * Find entities.
         * @param  {Object}   args - An option object.
         * @param  {string}   args.entity - The entity type to be found.
         * @param  {string}   [args.qty=50] - The number of results to return.
         * @param  {string}   [args.filter] - The property name to filter on.
         * @param  {Object}   [args.query] - A query object to use.
         * @param  {string}   [args.orderBy] - The property to order results by.
         * @param  {string}   [args.orderDirection] - The direction to order results in.
         * @param  {Function} cb   - Callback function
         * @return {void}
         */
        find(args, cb) {
          if (!args.entity) {
            cb(new Error('Must pass in an entity name.'));
          }
          if (args.qty && (typeof args.qty !== 'number' || args.qty < 0)) {
            cb(new Error('"qty" must be a positive number of results to return.'));
          }
          const qty = args.qty || 50;
          let payload = {
            method : `find${args.entity[0].toUpperCase()}${args.entity.slice(1)}`,
            params : {
              stubResponses : false
            },
            id : id.create()
          };
          if (args.qty) {
            payload.params.limit = (qty > 100) ? 100 : qty;
          }
          if (args.query) {
            payload.params.query = args.query;
          }
          if (args.orderBy) {
            payload.params.orderBy = args.orderBy;
          }
          if (args.orderDirection) {
            payload.params.orderDirection = args.orderDirection;
          }
          args.state = args.state || {};
          args.state.payload = args.state.payload || payload;
          args.state.results = args.state.results || [];
          this.send(args.state.payload, function (err, data) {
            if (err) {
              cb(err);
            }
            if (args.filter) {
              Array.prototype.push.apply(args.state.results, data.result.filter(function (result) {
                let filteredObj;
                args.filter.split('.').forEach(function (prop) {
                  filteredObj = filteredObj ? filteredObj[prop] : result[prop];
                });
                return filteredObj;
              }));
            } else {
              Array.prototype.push.apply(args.state.results, data.result);
            }

            if (!data.result) {
              return cb("no result from nutshell");
            }
            // Check if last page was received
            if (data.result.length < args.state.payload.params.limit) {
              cb(null, args.state.results);
            } else {
              if (args.state.results.length <= args.qty) {
                args.state.payload.params.page = args.state.payload.params.page ? args.state.payload.params.page + 1 : 2;
                this.find(args, cb);
              } else {
                cb(null, args.state.results.slice(0, args.qty));
              }
            }
          }.bind(this));
        }
      };
      cb(null, api);
    }
  ], function (err, api) {
    if (err) {
      callback(new Error(err));
      return;
    }
    callback(null, api);
  });
};
