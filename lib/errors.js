
var util = require('util');


/**
 * Expose errors.
 */

exports.BadRequest = BadRequestError;


/**
 * Error for a bad request to the API.
 *
 * @param {String} message
 * @param {Number} status
 * @param {String} body
 */

function BadRequestError (message, status, body) {
  Error.call(this);
  this.message = message;
  this.status = status;
  this.body = body;
  this.code = 'BAD_REQUEST';
}

util.inherits(BadRequestError, Error);