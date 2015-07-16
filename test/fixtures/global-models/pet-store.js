'use strict';

module.exports = require('waterline').Collection.extend({
  identity: 'petstore',
  connection: 'memory',
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
