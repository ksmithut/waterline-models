# waterline-models

[![NPM version](http://img.shields.io/npm/v/waterline-models.svg?style=flat)](https://www.npmjs.org/package/waterline-models)
[![Dependency Status](http://img.shields.io/david/ksmithut/waterline-models.svg?style=flat)](https://david-dm.org/ksmithut/waterline-models)
[![Dev Dependency Status](http://img.shields.io/david/dev/ksmithut/waterline-models.svg?style=flat)](https://david-dm.org/ksmithut/waterline-models#info=devDependencies&view=table)
[![Code Climate](http://img.shields.io/codeclimate/github/ksmithut/waterline-models.svg?style=flat)](https://codeclimate.com/github/ksmithut/waterline-models)
[![Build Status](http://img.shields.io/travis/ksmithut/waterline-models/master.svg?style=flat)](https://travis-ci.org/ksmithut/waterline-models)
[![Coverage Status](http://img.shields.io/codeclimate/coverage/github/ksmithut/waterline-models.svg?style=flat)](https://codeclimate.com/github/ksmithut/waterline-models)

Auto loads waterline models from a directory

# Installation

```bash
npm install --save waterline-models
```

# Usage

`models/user.js`

```js
module.exports = {
  identity: 'user',
  connection: 'default',
  attributes: {
    firstName: 'string',
    lastName: 'string'
  }
};
```

`app.js`

```js
var path = require('path');
var waterlineModels = require('waterline-models');
waterlineModels.init({
  dir: path.join(__dirname, 'models'),
  adapters: {
    memory: require('sails-memory-adapter')
  },
  connections: {
    default: {
      adapter: 'memory'
    }
  }
});

// This could be in another file
var User = require('waterline-models')('user'); // pass in the identity

User
  .then(function (Model) {
    return Model.create({
      firstName: 'Jack',
      lastName: 'Bliss'
    });
  })
  .then(function (user) {
    console.log(user);
    // {
    //   firstName: 'Jack',
    //   lastName: 'Bliss',
    //   createdAt: Some Date,
    //   updatedAt: Some Date,
    //   id: 1
    // }
  });
```

# Options

### `cwd`

The cwd directory to work off of when reading from the models directory

Default: `process.cwd()`

### `dir`

The path to your models directory

Default: `'models'`

### `defaultCollection`

All other options are passed into waterline's `initialize` method as the
configuration which is documented
[here](https://github.com/balderdashy/waterline-docs/blob/master/introduction/getting-started.md).
