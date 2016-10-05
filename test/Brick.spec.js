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

  lab.test('it properly set the default loaders', (endTest) => {
    let brick = new Brick('.');
    expect(brick._loaders).to.be.an.array().and.to.have.length(2);
    endTest();
  });

  lab.test('it properly fails if one of the loaders does not exist', (endTest) => {
    let brick = null;
    try {
      brick = new Brick('.', ['NonExisting']);
      Code.fail('The exception should be raise before this');
    } catch (err) {
      expect(err).to.be.an.error(Error, 'NonExistingLoader does not exist !');
    }
    endTest();
  });

  lab.test('it properly registers a simple loader', (endTest) => {
    let stub = Sinon.stub(require('path'), 'join');
    stub.onFirstCall().returns(`${__dirname}/mock/SimpleLoader`);

    let brick = new Brick(__dirname, ['Simple']);

    stub.restore();

    expect(brick._loaders).to.be.an.array().and.to.have.length(1);

    brick.register(mock.server, {}, () => {
      endTest();
    });
  });

  lab.test('it properly fails if one loader fails', (endTest) => {
    let pathStub = Sinon.stub(require('path'), 'join');
    pathStub.onFirstCall().returns(`${__dirname}/mock/SimpleLoader`);

    let brick = new Brick(__dirname, ['Simple']);

    pathStub.restore();

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
