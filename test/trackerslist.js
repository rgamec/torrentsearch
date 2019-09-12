// TorrentSearch 2019
// Test suite for verifying correctness of lib/trackerslist.js
var chai = require('chai');
var should = chai.should();
var assert = chai.assert;
const trackerslist = require('../lib/trackerslist.js')

describe('Trackerslist.js', function(){
  it('should contain at least one entry', function() {
    assert.isAtLeast(trackerslist.length, 1);
  });

  // Iterate through each tracker configured in lib/trackerslist.js
  for (let trackerEntry of trackerslist){
    // Ensure correct properties are set
    it(`'${trackerEntry.tracker}' entry should be syntactically valid - searchURL property exists`, function() {
      assert.exists(trackerEntry.searchURL,"No 'searchURL' property is set");
    });
    it(`'${trackerEntry.tracker}' entry should be syntactically valid - tracker property exists`, function() {
      assert.exists(trackerEntry.tracker,"No 'tracker' property is set");
    });
    it(`'${trackerEntry.tracker}' entry should be syntactically valid - resultsPageExtractor property exists`, function() {
      assert.exists(trackerEntry.resultsPageExtractor,"No 'resultsPageExtractor' property is set");
    });
    it(`'${trackerEntry.tracker}' entry should be syntactically valid - individualResultsParser property exists`, function() {
      assert.exists(trackerEntry.individualResultParser,"No 'individualResultParser' property is set");
    });

    // Ensure validity of the RegEx patterns
    if (trackerEntry.individualResultParser.description.regularExpression){
      it(`'${trackerEntry.tracker}' entry - RegExp for individualResultParser should be valid (Description)`, function() {
        assert.typeOf(new RegExp(trackerEntry.individualResultParser.regularExpression), 'regexp', 'we have a regular expression')
      });
    }
    if (trackerEntry.individualResultParser.magnetLink.regularExpression){
      it(`'${trackerEntry.tracker}' entry - RegExp for individualResultParser should be valid (MagnetLink)`, function() {
        assert.typeOf(new RegExp(trackerEntry.individualResultParser.magnetLink.regularExpression), 'regexp', 'we have a regular expression')
      });
    }
    if (trackerEntry.individualResultParser.size.regularExpression){
      it(`'${trackerEntry.tracker}' entry - RegExp for individualResultParser should be valid (Size)`, function() {
        assert.typeOf(new RegExp(trackerEntry.individualResultParser.size.regularExpression), 'regexp', 'we have a regular expression')
      });
    }
    if (trackerEntry.individualResultParser.seeders.regularExpression){
      it(`'${trackerEntry.tracker}' entry - RegExp for individualResultParser should be valid (Seeders)`, function() {
        assert.typeOf(new RegExp(trackerEntry.individualResultParser.seeders.regularExpression), 'regexp', 'we have a regular expression')
      });
    }
    if (trackerEntry.individualResultParser.leechers.regularExpression){
      it(`'${trackerEntry.tracker}' entry - RegExp for individualResultParser should be valid (Leechers)`, function() {
        assert.typeOf(new RegExp(trackerEntry.individualResultParser.leechers.regularExpression), 'regexp', 'we have a regular expression')
      });
    }
  }
});

