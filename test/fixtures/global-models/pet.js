'use strict';

module.exports = require('waterline').Collection.extend({
  identity: 'pet',
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
