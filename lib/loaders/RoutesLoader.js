'use strict';

const Loader = require('./Loader');

class RoutesLoader extends Loader {

  constructor (dirname) {
    super(dirname, '**/*.route.js');
  }

  apply (server, matches) {
    var routes = [];
    var errors = [];
    matches.forEach( m => {
      try {
        var routesFromFile = require(m);
        routes = routes.concat(routesFromFile);
      } catch (err) {
        errors.push(err);
      }
    });
    try {
      server.route(routes);
    }
    catch (err) {
      return Promise.reject(err);
    }
    if (errors.length > 0) {
      return Promise.reject(errors);
    }
    return Promise.resolve(routes);
  }

}

module.exports = RoutesLoader;
