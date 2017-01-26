// $lab:coverage:off$
'use strict';

var Code = require('code');
var Lab = require('lab');
var Sinon = require('sinon');
var lab = Lab.script();
var expect = Code.expect;

var Brick = require('../lib/Brick');

lab.suite('Brick:class', () => {

  let mock = {
    server: require('./mock/Server'),
    loader: require('./mock/SimpleLoader')
  };

  lab.test('it fails if no dirname', (endTest) => {
    let brick = null;
    try {
      brick = new Brick();
      Code.fail('The exception should be raise before this');
    } catch (err) {
      expect(err).to.be.an.error(Error, 'dirname is required !');
    }
    expect(brick).to.be.null();
    endTest();
  });

  lab.test('it properly set no default loaders', (endTest) => {
    let brick = new Brick('Test');
    expect(brick._loaders).to.be.an.array().and.to.have.length(0);
    endTest();
  });

  lab.test('it properly fails if one of the loaders does not exist', (endTest) => {
    let brick = null;
    try {
      brick = new Brick('.', ['NonExisting']);
      Code.fail('The exception should be raise before this');
    } catch (err) {
      expect(err).to.be.an.error(Error, 'The loader #1 seems invalid !');
    }
    endTest();
  });

  lab.test('it properly registers a simple loader', (endTest) => {
    let brick = new Brick(__dirname, [require('./mock/SimpleLoader')]);
    expect(brick._loaders).to.be.an.array().and.to.have.length(1);

    brick.register(mock.server, {}, () => {
      endTest();
    });
  });

  lab.test('it properly registers a simple loader with dependency', (endTest) => {
    let brick = new Brick(__dirname, [require('./mock/SimpleLoader')], ['NonExisting']);
    expect(brick._loaders).to.be.an.array().and.to.have.length(1);

    brick.register(mock.server, {}, () => {
      endTest();
    });
  });

  lab.test('it properly fails if one loader fails', (endTest) => {
    let brick = new Brick(__dirname, [require('./mock/SimpleLoader')]);
    expect(brick._loaders).to.be.an.array().and.to.have.length(1);

    let loaderStub = Sinon.stub(brick._loaders[0], 'process');
    loaderStub.onFirstCall().returns(Promise.reject('TestError'));
    brick.register(mock.server, {}, () => {
      loaderStub.restore();
      endTest();
    });
  });

});

module.exports.lab = lab;
// $lab:coverage:on$
