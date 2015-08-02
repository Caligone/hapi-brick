'use strict';

var Brick = require('./Brick'),
    version = require('../package.json').version;

module.exports.register = function (server, options, next) {
    server.expose('Engine', Brick);
    return next();
};

module.exports.register.attributes = {
    name: 'Brick',
    version: version
};
