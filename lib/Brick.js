'use strict';

const path = require('path');
const async = require('async');

/**
 * A brick is an object designed to be use as a Hapi plugin
 * It automagically injects models and routes by using globs from a dirname
 *
 * @param dirname The dirname of the folder
 * @param dependencies The other hapi plugins dependencies
 */
class Brick {

  constructor (dirname, loaders = ['Routes', 'Models'], dependencies = ['knex']) {
    if (!dirname) {
      throw new Error(`dirname is required !`);
    }
    this._dirname = dirname;
    this._dependencies = dependencies;
    this._loaders = [];
    loaders.forEach( (l) => {
      let CurrentLoader, loader;
      if (typeof l === 'function') {
          CurrentLoader = l;
      } else {
        try {
          CurrentLoader = require(path.join(__dirname, `loaders/${l}Loader`));
        }
        catch (ex) {
          throw new Error(`${l}Loader could not be found !`);
        }
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
