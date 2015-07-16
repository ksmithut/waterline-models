'use strict';

module.exports = require('waterline').Collection.extend({
  identity: 'petstore',
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
});
