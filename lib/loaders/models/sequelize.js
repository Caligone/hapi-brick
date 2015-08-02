'use strict';

var async = require('async'),
    glob = require('glob'),
    Sequelize = require('sequelize');
    _ = require('underscore');

function SequelizeModelLoader (brickDirectory, server, options) {

    return function (next) {
        async.auto({
            init: function (endInit) {
                endInit(null, options);
            },
            connect: ['init', function (endPostgreSQL, results) {
                // Connect to the sequelize DB
                var sequelize = new Sequelize(results.init.options.uri, results.init.options.opts);
                // Expose the sequelize object
                server.expose('sequelize', sequelize);
                endPostgreSQL(null, sequelize);
            }],
            getModels: ['connect', function (endGetModels, results) {
                glob(brickDirectory + "./**/*.model.js", options, function (err, files) {
                    try {
                        _.each(files, function (f) {
                            var model = results.connect.import(p);
                            models[model.name] = model;
                        });
                        // Add the associations between models
                        Object.keys(models).forEach(function (modelName) {
                            if ("associate" in models[modelName]) {
                                models[modelName].associate(models);
                            }
                        });
                        // Expose the models
                        server.expose('models', models);
                        return endGetModels(null, files.length);
                    }
                    catch (e) {
                        return endGetModels(e);
                    }
                });
            }],
            syncModels: ['getModels', function (endSyncModels, results) {
                // Sync the models with the default parameters (cf config.json)
                results.connect.sync().then(function () {
                    endSyncModels();
                });
            }]
        }, function (err, results) {
            if (err) {
                return next(err);
            }
            return next(null, results.getModels);
        });
    };
}

module.exports = SequelizeModelLoader;