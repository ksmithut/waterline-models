'use strict';
/* jshint maxstatements: false */

var expect = require('chai').expect;
var getModels = require('../');
var path = require('path');

var MODELS_PATH = path.join(__dirname, 'fixtures', 'models');

describe('WaterlineModels tests', function () {

  it('should load all waterline collections from directory', function () {
    var modelsInit = getModels({
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

});