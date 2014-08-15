
/**
 * Module dependencies.
 */

var events = require('analytics-events');

/**
 * Methods to wrap.
 */

var methods = [
  'identify',
  'screen',
  'alias',
  'track',
  'group',
  'page'
];

/**
 * Wrap methods of `integration`.
 *
 *    - uses `mapper` if possible
 *    - routes all ecommerce events to other methods if possible.
 *
 * @param {Integration} integration
 * @api private
 */

module.exports = function(integration){
  var mapper = integration.mapper || {};

  // use mapper.
  methods.forEach(function(method){
    if (!mapper[method]) return;
    var fn = integration[method];
    integration[method] = function*(msg, settings){
      var fn = fn.bind(this);
      var payload = mapper[method].call(this, msg, settings);
      this.debug('mapped %j to %j', msg, payload);
      return yield fn(payload, settings);
    };
  });

  // route ecommerce
  var track = integration.track;
  integration.track = function*(msg, settings){
    var event = msg.event();

    for (var method in events) {
      var regexp = events[method];
      var fn = this[method];
      if (!fn || !regexp.test(event)) continue;
      return yield fn(msg, settings);
    }

    return yield track(msg, settings);
  };
};
