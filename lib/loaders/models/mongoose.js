'use strict';

var async = require('async'),
    glob = require('glob'),
    mongoose = require('mongoose'),
    path = require('path'),
    _ = require('underscore');

function MongooseModelLoader (brickDirectory, server, options) {

    return function (next) {
        async.auto({
            init: function (endInit) {
                endInit(null, options);
            },
            connect: ['init', function (endMongo, results) {
                if (mongoose.connection.readyState) {
                    server.expose('mongo', mongoose);
                    return endMongo(null, mongoose);
                }
                mongoose.connect(results.init.options.uri, results.init.options.opts);

                mongoose.connection.once('open', function () {
                    server.expose('mongo', mongoose);
                    endMongo(null, mongoose);
                });

                mongoose.connection.on('error', function (err) { 
                    console.error(err);
                    throw 'Mongo connection error';
                });
            }],
            getModels: ['connect', function (endGetModels, results) {
                glob(brickDirectory + "/**/*.model.js", options, function (err, files) {
                    _.each(files, function (f) {
                        server.expose(path.basename(f, '.model.js') + 'Model', require(f)(results.connect));
                    });
                    endGetModels(null);
                });
            }]
        }, function (err, results) {
            next();
        });
    };
}

module.exports = MongooseModelLoader;