
var Errors = require('./errors');
var methods = require('segmentio-api-methods');


/**
 * Wrap a response in a common handler that filters for bad status codes and
 * turns them into an error.
 *
 * @param {Function} callback
 * @return {Function}
 * @api private
 */

Integration.prototype.wrap = function (callback) {
  var self = this;

  return function (err, res, body) {
    if (err) return callback(err);
    var status = res.statusCode;
    if (status === 200 || status === 201 || status === 204) return callback(null, body);

    var message = util.format('Failed %s request: %s.', self.name, status);
    self.debug('%s %s', message, body);
    err = new Errors.BadRequest(message, status, body);
    return callback(err);
  };
};


/**
 * Get or set the redis client for the integration.
 *
 * @param {Redis} redis
 * @return {Redis or Integration}
 * @api private
 */

Integration.prototype.redis = function (redis) {
  if (!redis) return this._redis;
  this._redis = redis;
  return this;
};


/**
 * Generate no-op methods that always take a `callback` as the last argument.
 */

methods.forEach(function (method) {
  exports[method] = function () {
    var callback = arguments[arguments.length - 1];
    if (callback) process.nextTick(callback);
  };
});