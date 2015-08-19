'use strict';

module.exports = {
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
};
