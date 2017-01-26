'use strict';

const async = require('async');

/**
 * A brick is an object designed to be use as a Hapi plugin
 * It automagically injects models and routes by using globs from a dirname
 *
 * @param dirname The dirname of the folder
 * @param dependencies The other hapi plugins dependencies
 */
class Brick {

  constructor (dirname, loaders = [], dependencies = []) {
    if (!dirname) {
      throw new Error(`dirname is required !`);
    }
    this._dirname = dirname;
    this._dependencies = dependencies;
    this._loaders = [];
    loaders.forEach( (l, k) => {
      let CurrentLoader, loader;
      if (typeof l === 'function') {
        CurrentLoader = l;
      } else {
        throw new Error(`The loader #${k + 1} seems invalid !`);
      }
      loader = new CurrentLoader(this._dirname);
      this._loaders.push(loader);
    });
  }

  register(server, options, next) {
    server.dependency(this._dependencies, (server, done) => {
      async.each(this._loaders, (l, nextLoader) => {
        l.process(server)
          .then( () => {
            return nextLoader();
          })
          .catch( (err) => {
            return nextLoader(err);
          });
      }, (err) => {
        done(err);
      });
    });
    next();
  }
}

module.exports = Brick;
