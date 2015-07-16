'use strict';

module.exports = require('waterline').Collection.extend({
  identity: 'user',
  connection: 'memory',
  attributes: {
    firstName: 'string',
    lastName: 'string',
    pets: {
      collection: 'pet',
      via: 'owner'
    }
  }
});
