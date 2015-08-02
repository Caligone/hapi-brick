'use strict';

var async = require('async'),
    glob = require('glob'),
    _ = require('underscore');

function Brick (dirname, opts) {
    // Check the use of new
    if (!(this instanceof Brick)) {
        throw new Error('You have to use ’new’ to create an instance of Brick');
    }

    // Check the dirname
    if(!(dirname)) {
        throw new Error('dirname have to be defined');
    }

    this.register = function (server, options, next) {
         async.auto({
            // Load the routes
            routes: function (endLoadRoutes) {
                // Get the route files
                glob(dirname + "/**/*.route.js", options, function (err, files) {
                    var routes = [];
                    _.each(files, function (f) {
                        routes = routes.concat(f);
                    });
                    server.route(routes);
                    endLoadRoutes(null);
                });
            }
        }, function (err, results) {
            next();
        });
    };

    this.register.attributes = opts.attributes;

    return this;
}

module.exports = Brick;