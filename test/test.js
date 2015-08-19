'use strict';
/* jshint maxstatements: false */
/* jshint maxlen: false */

var expect = require('chai').expect;
var path = require('path');
var clearRequire = require('clear-require');

var MODELS_PATH = path.join(__dirname, 'fixtures', 'models');

function getModule() {
  clearRequire('../');
  clearRequire('sails-memory');
  return require('../');
}

describe('WaterlineModels tests', function () {

  it('should load all models from a directory', function () {
    var waterlineModels = getModule();
    waterlineModels.init({
      dir: MODELS_PATH,
      adapters: { memory: require('sails-memory') },
      connections: { default: { adapter: 'memory' } }
    });
    return waterlineModels().then(function (collections) {
      expect(collections.user.waterline).to.be.an('object');
      expect(collections.pet.waterline).to.be.an('object');
    });
  });

  it('should throw an error if attempt to initialize more than once', function () {
    var waterlineModels = getModule();
    return waterlineModels
      .init({
        dir: MODELS_PATH,
        adapters: { memory: require('sails-memory') },
        connections: { default: { adapter: 'memory' } }
      })
      .then(function () {
        expect(waterlineModels.init).to.throw('');
      });
  });

  it('should be able to attempt to get models before initialization', function () {
    var waterlineModels = getModule();
    var User = waterlineModels('user');
    waterlineModels.init({
      dir: MODELS_PATH,
      adapters: { memory: require('sails-memory') },
      connections: { default: { adapter: 'memory' } }
    });
    return User
      .then(function (model) {
        return model.create({firstName: 'Jack', lastName: 'Bliss'});
      })
      .then(function (user) {
        expect(user).to.have.property('firstName', 'Jack');
        expect(user).to.have.property('lastName', 'Bliss');
        expect(user).to.have.property('id', 1);
      });
  });

});
