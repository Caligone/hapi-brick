// $lab:coverage:off$
'use strict';

var Code = require('code');
var Lab = require('lab');
var path = require('path');
var lab = Lab.script();
var expect = Code.expect;

var ModelsLoader = require('../../lib/loaders/ModelsLoader');

lab.suite('ModelsLoader:class', () => {

  let mock = {
    server: require('../mock/Server'),
  };

  lab.test('it properly set the default attributes', (endTest) => {
    let modelsLoader = new ModelsLoader(__dirname);
    expect(modelsLoader).to.not.be.null();
    expect(modelsLoader._pattern).to.be.equal('**/*.model.js');
    expect(modelsLoader._dirname).to.be.equal(__dirname);
    endTest();
  });

  lab.test('it properly expose the models', (endTest) => {
    let modelsLoader = new ModelsLoader(__dirname);
    modelsLoader.apply(mock.server, [path.join(__dirname, '../mock/samples/a.js'), path.join(__dirname, '../mock/samples/b.js')])
      .then(function (models) {
        expect(models).to.be.an.object().and.to.have.length(2);
        endTest();
      });
  });
});

module.exports.lab = lab;
// $lab:coverage:on$
