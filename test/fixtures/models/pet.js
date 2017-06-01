'use strict'

module.exports = {
  identity: 'pet',
  connection: 'default',
  attributes: {
    breed: 'string',
    type: 'string',
    name: 'string',

    // Add a reference to User
    owner: {
      model: 'user'
    }
  }
}
