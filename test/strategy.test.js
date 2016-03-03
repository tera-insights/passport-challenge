/* global describe, it, expect */

var Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  var strategy = new Strategy(function(){});
    
  it('should be named challenge', function() {
    expect(strategy.name).to.equal('challenge');
  });
  
  it('should throw if constructed without a verify callback', function() {
    expect(function() {
      var s = new Strategy();
    }).to.throw(TypeError, 'ChallengeStrategy requires a verify callback');
  });
  
});