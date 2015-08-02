'use strict';

var async = require('async'),
    glob = require('glob'),
    _ = require('underscore'),
    path = require('path');

function ClassicRouteLoader (brickDirectory, server, options) {
    return function (next) {
        glob(brickDirectory + "/**/*.route.js", options, function (err, files) {
            try {
                _.each(files, function (f) {
                    server.route(require(f));
                });
                return next(null, files.length);
            }
            catch (e) {
                return next(e);
            }
        });
    };
}

module.exports = ClassicRouteLoader;