'use strict';

const path = require('path');

const Loader = require('./Loader');

class MailersLoader extends Loader {

  constructor (dirname) {
    super(dirname, '**/*.mailer.js');
  }

  apply (server, matches) {
    var mailers = {};
    matches.forEach( (m) => {
      var mailerName = path.basename(m, '.mailer.js').replace('Mailer', '');
      var MailerFromFile = require(m);
      mailers[mailerName] = new MailerFromFile(server.plugins.mailer);
    });

    server.expose('mailers', mailers);
    return Promise.resolve(mailers);
  }

}

module.exports = MailersLoader;
