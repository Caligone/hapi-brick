// $lab:coverage:off$
'use strict';

var Code = require('code');
var Lab = require('lab');
var lab = Lab.script();
var expect = Code.expect;

var Loader = require('../../lib/loaders/Loader');

lab.suite('Loader:class', () => {

  lab.test('it fails if try to instanciate', (endTest) => {
    let loader = null;
    try {
      loader = new Loader();
      Code.fail('The exception should be raise before this');
    } catch (err) {
      expect(err).to.be.an.error(Error, 'Cannot build a Loader abstract instance !');
    }
    expect(loader).to.be.null();
    endTest();
  });
});

module.exports.lab = lab;
// $lab:coverage:on$
