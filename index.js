'use strict';

var Promise    = require('bluebird');
var assert     = require('assert');
var path       = require('path');
var assign     = require('object-assign');
var requireDir = require('require-dir');

var init;
var configured;
var initPromise = Promise.fromNode(function (cb) { init = cb; });

module.exports = exports = function (name) {
  return initPromise.then(function (collections) {
    if (!name) { return collections; }
    assert(collections[name], 'No collection with name "' + name + '" exists');
    return collections[name];
  });
};

exports.Waterline = require('waterline');
exports.init = function (config) {
  assert(
    !configured,
    'You can only initialize waterline-models once'
  );

  configured = true;

  config = assign({
    cwd: process.cwd(),
    dir: 'models',
    adapters: {},
    connections: {}
  }, config);

  var Waterline = exports.Waterline;
  var Collection = Waterline.Collection;
  var dir = path.resolve(config.cwd, config.dir);

  return Promise.resolve(new Waterline())
    .then(function (waterline) {
      var collectionFiles = requireDir(dir);
      Object.keys(collectionFiles).forEach(function (collectionName) {
        var collection = assign(
          {identity: collectionName},
          collectionFiles[collectionName]
        );
        waterline.loadCollection(Collection.extend(collection));
      });
      return Promise.fromNode(function (cb) {
        waterline.initialize({
          adapters: config.adapters,
          connections: config.connections
        }, cb);
      });
    })
    .then(function (ontology) { return ontology.collections; })
    .nodeify(init);
};
