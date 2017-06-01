/* eslint-env mocha */
'use strict'

const chai = require('chai')
const path = require('path')
const clearRequire = require('clear-require')

const expect = chai.expect
const MODELS_PATH = path.join(__dirname, 'fixtures', 'models')

function getModule () {
  clearRequire('../')
  clearRequire('sails-memory')
  return require('../')
}

describe('WaterlineModels tests', () => {
  it('should load all models from a directory', () => {
    var waterlineModels = getModule()
    waterlineModels.init({
      dir: MODELS_PATH,
      adapters: { memory: require('sails-memory') },
      connections: { default: { adapter: 'memory' } }
    })
    return waterlineModels().then(collections => {
      expect(collections.user.waterline).to.be.an('object')
      expect(collections.pet.waterline).to.be.an('object')
    })
  })

  it('should throw an error if attempt to initialize more than once', () => {
    var waterlineModels = getModule()
    return waterlineModels
      .init({
        dir: MODELS_PATH,
        adapters: { memory: require('sails-memory') },
        connections: { default: { adapter: 'memory' } }
      })
      .then(() => {
        expect(waterlineModels.init).to.throw('')
      })
  })

  it('should be able to attempt to get models before initialization', () => {
    var waterlineModels = getModule()
    var User = waterlineModels('user')
    waterlineModels.init({
      dir: MODELS_PATH,
      adapters: { memory: require('sails-memory') },
      connections: { default: { adapter: 'memory' } }
    })
    return User.then(model => {
      return model.create({ firstName: 'Jack', lastName: 'Bliss' })
    }).then(user => {
      expect(user).to.have.property('firstName', 'Jack')
      expect(user).to.have.property('lastName', 'Bliss')
      expect(user).to.have.property('id', 1)
    })
  })
})
