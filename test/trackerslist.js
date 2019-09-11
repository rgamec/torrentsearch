// Boilerplate.
var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
const trackerslist = require('../lib/trackerslist.js')

describe('Trackerslist', function(){
  it('should contain two entries', function() {
    assert.equal(trackerslist.length, 2);
  });

});
