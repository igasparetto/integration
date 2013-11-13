
var debug = require('debug');
var Errors = require('./errors');
var protos = require('./protos');
var request = require('request-retry');
var slug = require('slug');


/**
 * Expose `createIntegration`.
 */

module.exports = exports = createIntegration;


/**
 * Expose `Errors`.
 */

exports.Errors = Errors;


/**
 * Create a new `Integration` with `name`.
 *
 * @param {String} name
 * @return {Integration}
 */

function createIntegration (name) {
  if (!name) throw new Error('name required');

  /**
   * Initialize a new `Integration` with `options`.
   *
   * @param {Object} options
   *   @property {Number} retries (2)
   */

  function Integration (options) {
    options = options || {};
    this.debug = debug('segmentio:integration:' + slug(name));
    this.request = request({ retries: options.retries || 2 });
  }

  Integration.prototype.name = name;
  for (var key in protos) Integration.prototype[key] = protos[key];
  return Integration;
}