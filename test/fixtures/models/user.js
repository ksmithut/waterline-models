'use strict';

module.exports = require('../../../').Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    firstName: 'string',
    lastName: 'string',
    pets: {
      collection: 'pet',
      via: 'owner'
    }
  }
});
