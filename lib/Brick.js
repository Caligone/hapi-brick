'use strict';

var async = require('async'),
    glob = require('glob'),
    _ = require('underscore'),
    path = require('path');

function Brick (brickDirectory, opts) {
    // Check the use of new
    if (!(this instanceof Brick)) {
        throw new Error('You have to use ’new’ to create an instance of Brick');
    }

    if (!brickDirectory || typeof brickDirectory !== 'string') {
        throw new Error('brickDirectory is required');
    }

    this.register = function (server, options, next) {

        options = _.defaults(options, {
            loaders: {
                routes: "classic",
                models: "none",
                tests: "classic",
            }
        });
        var loaders = {
            routes: require('./loaders/routes/' + options.loaders.routes)(brickDirectory, server, {}),
        };

        if(options.loaders.models !== 'none'){
          loaders.models = require('./loaders/models/' + options.loaders.models)(brickDirectory, server, options.models);
        } else {
          loaders.models = function(callback){return callback();}
        }

        async.auto({
            // Load the routes
            routes: loaders.routes
            // Load the models
        }, function (err, results) {
            if (err) {
                throw err;
            }
            next();
        });
    };

    this.register.attributes = opts.attributes;

    return this;
}

module.exports = Brick;
