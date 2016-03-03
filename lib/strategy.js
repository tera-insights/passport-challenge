/**
 * Implementation of challenge strategy. The code is heavily inspired from Jared
 * Hanson's implementaion of passport-local
 */

var passport = require('passport-strategy');
var util = require('util');
var lookup = require('./utils').lookup;

/**
 * Strategy constructor
 *
 * The challenge based strategy authenticates requests based on challenges (send
 * to the user by other means or time based) and digital signatures.
 *
 * The application must provide the means to verify the digital signature in the
 * form of the `verifyFct` argument. This strategy only provides the management.
 *
 * Optional field `options` can be used to change the fields in which the parts
 * are found.
 *
 * Options:
 *  - `usernameField` field name where username is found, default _username_
 *  - `challengeField` field name where challenge is found, default _challenge_
 *  - `signatueField` field name where digital signature is found, default _signature_
 *
 *	Examples:
 * ```
 * 	passport.use( new ChallengeStrategy(
 * 		function(username, challenge, signature, done){
 * 			User.findOne({username: username}, function (err, user){
 * 				// 1. check validity of challenge					
 * 				// 2. check user signature 
 * 				done(err, user);
 * 			});
 * 		}	
 * 	));
 * ```
 * @param {Object} options   (optional) Options to controll the field extraction
 * @param {Function()} verityFct Verification function
 */
 function Strategy(options, verifyFct){
 	if (typeof options == 'function') {
 		verifyFct = options;
 		options = {};
 	}
 	if (!verifyFct) { throw new TypeError('ChallengeStrategy requires a verify callback'); }

 	this._usernameField = options.usernameField || 'username';
 	this._challengeField = options.challengeField || 'challenge';
 	this._signatureField = options.signatureField || 'signature';

 	passport.Strategy.call(this);
 	this.name = 'challenge';
 	this._verify = verifyFct;
 	this._passReqToCallback = options.passReqToCallback;
 }

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var username = lookup(req.body, this._usernameField) || lookup(req.query, this._usernameField);
  var challenge = lookup(req.body, this._challengeField) || lookup(req.query, this._challengeField);
  var signature = lookup(req.body, this._signatureField) || lookup(req.query, this._signatureField);
  
  if (!username || !challenge || !signature) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }
  
  var self = this;
  
  function verified(err, user, info) {
    if (err) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }
  
  try {
    if (self._passReqToCallback) {
      this._verify(req, username, challenge, signature, verified);
    } else {
      this._verify(username, challenge, signature, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;