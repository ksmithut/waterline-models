'use strict';

var Promise    = require('bluebird');
var path       = require('path');
var assign     = require('object-assign');
var requireDir = require('require-dir');

var globalInitialized = false;

module.exports = exports = function (config) {
  if (globalInitialized) {
    return Promise.reject(
      new Error('WaterlineModels has already been initialized')
    );
  }
  globalInitialized = true;

  var models = new Models(config);
  return models.getModels();
};

function Models(config) {
  if (!(this instanceof Models)) { return new Models(config); }

  config = assign({
    dir: path.resolve('models'),
    adapters: {},
    connections: {}
  }, config);

  var initialize = Promise.resolve(new exports.Waterline())
    .then(function (waterline) {
      var collectionFiles = requireDir(config.dir);
      Object.keys(collectionFiles).forEach(function (collectionName) {
        var collection = collectionFiles[collectionName];
        return waterline.loadCollection(collection);
      });
      return Promise.fromNode(function (cb) {
        waterline.initialize(config, cb);
      });
    })
    .then(function (ontology) {
      Object.keys(ontology.collections).forEach(function (modelKey) {
        exports[modelKey] = ontology.collections[modelKey];
      });
      return ontology.collections;
    });

  this.getModels = function () { return initialize; };
}

exports.Waterline = require('waterline');
exports.WaterlineModels = Models;
