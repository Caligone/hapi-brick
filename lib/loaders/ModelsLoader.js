'use strict';

const path = require('path');

const Loader = require('./Loader');

class ModelsLoader extends Loader {

  constructor (dirname) {
    super(dirname, '**/*.model.js');
  }

  apply (server, matches) {
    var models = {};
    matches.forEach( (m) => {
      var modelName = path.basename(m, '.model.js').replace('Model', '');
      var modelFromFile = require(m);
      models[modelName] = new modelFromFile(server.plugins.knex.client);
    });

    server.expose('models', models);
    return Promise.resolve(models);
  }

}

module.exports = ModelsLoader;
