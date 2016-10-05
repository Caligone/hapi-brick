// $lab:coverage:off$
'use strict';

var Code = require('code');
var Lab = require('lab');
var path = require('path');
var Sinon = require('sinon');
var lab = Lab.script();
var expect = Code.expect;

var RoutesLoader = require('../../lib/loaders/RoutesLoader');

lab.suite('RoutesLoader:class', () => {

  let mock = {
    server: require('../mock/Server'),
  };

  lab.test('it properly sets the default attributes', (endTest) => {
    let routesLoader = new RoutesLoader(__dirname);
    expect(routesLoader).to.not.be.null();
    expect(routesLoader._pattern).to.be.equal('**/*.route.js');
    expect(routesLoader._dirname).to.be.equal(__dirname);
    endTest();
  });

  lab.test('it properly exposes the routes', (endTest) => {
    let routesLoader = new RoutesLoader(__dirname);
    routesLoader.apply(mock.server, [path.join(__dirname, '../mock/samples/a.js'), path.join(__dirname, '../mock/samples/b.js')])
      .then(function (routes) {
        expect(routes).to.be.an.array().and.to.have.length(2);
        endTest();
      });
  });

  lab.test('it properly loads the files', (endTest) => {
    let routesLoader = new RoutesLoader(__dirname);
    let stub = Sinon.stub(require('glob'), 'sync');
    stub.onFirstCall().returns([path.join(__dirname, '../mock/samples/a.js'), path.join(__dirname, '../mock/samples/b.js')]);
    routesLoader.process(mock.server)
      .then((routes) => {
        expect(routes).to.be.an.array().and.to.have.length(2);
        stub.restore();
        endTest();
      });
  });


  lab.test('it properly failed if an error happend during apply', (endTest) => {
      let routesLoader = new RoutesLoader(__dirname);
      let stub = Sinon.stub(require('glob'), 'sync');
      stub.onFirstCall().returns([path.join(__dirname, '../mock/samples/c.js')]);
      routesLoader.process(mock.server)
        .catch((err) => {
          stub.restore();
          expect(err).to.be.an.array().and.to.have.length(1);
          endTest();
        });
  });
});

module.exports.lab = lab;
// $lab:coverage:on$
