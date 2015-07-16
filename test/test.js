'use strict';
/* jshint maxstatements: false */

var expect = require('chai').expect;
var getModels = require('../');
var path = require('path');

var MODELS_PATH = path.join(__dirname, 'fixtures', 'models');
var BAD_MODELS_PATH = path.join(__dirname, 'fixtures', 'bad-models');
var GLOBAL_MODELS_PATH = path.join(__dirname, 'fixtures', 'global-models');

describe('WaterlineModels tests', function () {

  it('should load all waterline collections from directory', function () {
    var modelsInit = getModels.WaterlineModels({
      dir: MODELS_PATH,
      adapters: {
        memory: require('sails-memory')
      },
      connections: {
        default: {
          adapter: 'memory'
        }
      }
    });
    var models, user;
    return modelsInit.getModels()
      .then(function (foundModels) {
        models = foundModels;
        return models.user.create({
          firstName: 'jack',
          lastName: 'black'
        });
      })
      .then(function (createdUser) {
        user = createdUser;
        return models.pet.create({
          breed: 'yorky',
          type: 'dog',
          name: 'Ellie May',
          owner: user.id
        });
      })
      .then(function () {
        return models.pet.create({
          breed: 'chug',
          type: 'dog',
          name: 'Grr',
          owner: user.id
        });
      })
      .then(function () {
        return models.user.find().populate('pets');
      })
      .then(function (users) {
        expect(users[0]).to.have.deep.property('id', user.id);
        expect(users[0]).to.have.deep.property('firstName', 'jack');
        expect(users[0]).to.have.deep.property('lastName', 'black');
        expect(users[0]).to.have.deep.property('pets.0.id', 1);
        expect(users[0]).to.have.deep.property('pets.0.breed', 'yorky');
        expect(users[0]).to.have.deep.property('pets.0.type', 'dog');
        expect(users[0]).to.have.deep.property('pets.0.name', 'Ellie May');
        expect(users[0]).to.have.deep.property('pets.0.owner', user.id);
        expect(users[0]).to.have.deep.property('pets.1.id', 2);
        expect(users[0]).to.have.deep.property('pets.1.breed', 'chug');
        expect(users[0]).to.have.deep.property('pets.1.type', 'dog');
        expect(users[0]).to.have.deep.property('pets.1.name', 'Grr');
        expect(users[0]).to.have.deep.property('pets.1.owner', user.id);
      });
  });

  it('should fail if file is not valid collection', function () {
    var modelsInit = getModels.WaterlineModels({
      dir: BAD_MODELS_PATH,
      adapters: {
        memory: require('sails-memory')
      },
      connections: {
        default: {
          adapter: 'memory'
        }
      }
    });
    var error;
    return modelsInit.getModels()
      .catch(function (err) { error = err; })
      .finally(function () {
        expect(error).to.be.instanceOf(Error);
      });
  });

  it('should do "global" models', function () {
    return getModels({
      dir: GLOBAL_MODELS_PATH,
      adapters: {
        memory: require('sails-memory')
      },
      connections: {
        memory: {
          adapter: 'memory'
        }
      }
    }).then(function () {
      return getModels.user.create({
        firstName: 'blue',
        lastName: 'bird'
      });
    }).then(function (user) {
      return getModels.user.findById(user.id);
    }).then(function (users) {
      var user = users[0];
      expect(user).to.have.property('id', 1);
      expect(user).to.have.property('firstName', 'blue');
      expect(user).to.have.property('lastName', 'bird');
    }).then(function () {
      return getModels().catch(function (err) { return err; });
    }).then(function (err) {
      expect(err).to.be.instanceOf(Error);
    });
  });

});
