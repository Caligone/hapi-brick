'use strict';

const glob = require('glob');

/**
 *  The abstract Loader class using by Hapi Brick engine
 *  A loader is a small piece of code that auto load some feature for a custom Brick
 */
class Loader {

  /**
   * The abstract Loader constructor
   *  @param pattern The valid Glob pattern that matches with the wanted files
   *  @param dirname The dirname of the Brick provided by the Brick class
   */
  constructor(dirname, pattern) {
    if (new.target === Loader) {
      throw new Error('Cannot build a Loader abstract instance !');
    }
    this._dirname = dirname;
    this._pattern = pattern;
  }

  /**
   * The process methods retrieve the files that match and call apply on all of them
   * @param The Hapi server provided by the Brick class
   * @return Promise with all of the processed items
   */
  process (server) {
    var matches = glob.sync(`${this._dirname}/${this._pattern}`, {});
    return this.apply(server, matches);
  }

  /**
   * The abstract apply method is the core of the loader and have to be customized
   * It takes an array that contains all the files that matched and perform some actions with them
   * @param The Hapi server provided by the getMatches method
   * @param The array that contains the matched files
   * @return The processed items
   */
   /*
  apply (server, matches) {
    return new Promise.resolve(matches);
  }
  */
}

module.exports = Loader;
