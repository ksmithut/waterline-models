'use strict'

const Bluebird = require('bluebird')
const assert = require('assert')
const path = require('path')
const requireDir = require('require-dir')

let init, configured
const initPromise = Bluebird.fromCallback(cb => {
  init = cb
})

module.exports = exports = name => {
  return initPromise.then(collections => {
    if (!name) return collections
    assert(collections[name], 'No collection with name "' + name + '" exists')
    return collections[name]
  })
}

exports.Waterline = require('waterline')
exports.init = config => {
  assert(!configured, 'You can only initialize waterline-models once')

  configured = true

  config = Object.assign(
    {
      cwd: process.cwd(),
      dir: 'models',
      adapters: {},
      connections: {}
    },
    config
  )

  const Waterline = exports.Waterline
  const Collection = Waterline.Collection
  const dir = path.resolve(config.cwd, config.dir)

  return Bluebird.resolve(new Waterline())
    .then(waterline => {
      const collectionFiles = requireDir(dir)
      Object.keys(collectionFiles).forEach(collectionName => {
        const collection = Object.assign(
          { identity: collectionName },
          collectionFiles[collectionName]
        )
        waterline.loadCollection(Collection.extend(collection))
      })
      return Bluebird.fromCallback(cb => {
        waterline.initialize(
          {
            adapters: config.adapters,
            connections: config.connections
          },
          cb
        )
      })
    })
    .then(ontology => {
      return ontology.collections
    })
    .nodeify(init)
}
