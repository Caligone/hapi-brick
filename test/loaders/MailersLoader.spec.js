// $lab:coverage:off$
'use strict';

var Code = require('code');
var Lab = require('lab');
var path = require('path');
var lab = Lab.script();
var expect = Code.expect;

var MailersLoader = require('../../lib/loaders/MailersLoader');

lab.suite('MailersLoader:class', () => {

  let mock = {
    server: require('../mock/Server'),
  };

  lab.test('it properly set the default attributes', (endTest) => {
    let mailersLoader = new MailersLoader(__dirname);
    expect(mailersLoader).to.not.be.null();
    expect(mailersLoader._pattern).to.be.equal('**/*.mailer.js');
    expect(mailersLoader._dirname).to.be.equal(__dirname);
    endTest();
  });

  lab.test('it properly expose the mailers', (endTest) => {
    let mailersLoader = new MailersLoader(__dirname);
    mailersLoader.apply(mock.server, [path.join(__dirname, '../mock/samples/a.js'), path.join(__dirname, '../mock/samples/b.js')])
      .then(function (mailers) {
        expect(mailers).to.be.an.object().and.to.have.length(2);
        endTest();
      });
  });
});

module.exports.lab = lab;
// $lab:coverage:on$
