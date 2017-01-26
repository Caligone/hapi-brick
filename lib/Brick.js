'use strict';

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

  _register(server, next) {
    let promises = [];
    this._loaders.forEach( (l, nextLoader) => {
      promises.push(l.process(server));
    });
    Promise.all(promises)
      .then( (values) => {
          next();
      })
      .catch(next)
  }

  register(server, options, next) {
    if (this._dependencies.length <= 0) {
      return this._register(server, next);
    }
    server.dependency(this._dependencies, this._register.bind(this, server, next));
  }
}

module.exports = Brick;
