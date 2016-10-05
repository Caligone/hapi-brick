// $lab:coverage:off$
'use strict';

let server = {
  dependency: (dependencies, next) => {
    next(this, () => {});
  },
  expose: (key, value) => {
    this[key] = value;
  },
  route: (routes) => {
    this._routes = routes;
  },
  plugins: {
    knex: {
      client: 'mock'
    }
  }
};

module.exports = server;
// $lab:coverage:on$
