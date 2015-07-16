'use strict';

var Promise    = require('bluebird');
var path       = require('path');
var assign     = require('object-assign');
var requireDir = require('require-dir');

module.exports = Models;

function Models(config) {
  if (!(this instanceof Models)) { return new Models(config); }

  config = assign({
    dir: path.resolve('models'),
    adapters: {},
    connections: {}
  }, config);

  var initialize = Promise.resolve(new Models.Waterline())
    .then(function (waterline) {
      var collectionFiles = requireDir(config.dir);
      Object.keys(collectionFiles).forEach(function (collectionName) {
        waterline.loadCollection(collectionFiles[collectionName]);
      });
      return Promise.fromNode(function (cb) {
        waterline.initialize(config, cb);
      });
    })
    .then(function (ontology) {
      return ontology.collections;
    });

  this.getModels = function () { return initialize; };
}

Models.Waterline = require('waterline');
Models.Collection = Models.Waterline.Collection;
