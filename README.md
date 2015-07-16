# waterline-models

[![io.js compatibility](https://img.shields.io/badge/io.js-compatible-brightgreen.svg?style=flat)](https://iojs.org/)
[![node.js compatibility](https://img.shields.io/badge/node.js-compatible-brightgreen.svg?style=flat)](https://nodejs.org/)

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
module.exports = require('waterline-models').Collection.extend({
  identity: 'user',
  connection: 'default',
  attributes: {
    firstName: 'string',
    lastName: 'string'
  }
});
```

`app.js`

```js
var path = require('path');
var WaterlineModels = require('waterline-models').WaterlineModels;
var appModels = new WaterlineModels({
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

appModels.getModels()
  .then(function (models) {
    return models.user.create({
      firstName: 'Jack',
      lastName: 'Black'
    });
  })
  .then(function (createdUser) {
    return models.user.find({firstName: 'Jack'});
  });
```

You can also just make the models available on the module directly

`app.js`

```js
var path = require('path');
require('waterline-models')({
  dir: path.join(__dirname, 'models'),
  adapters: {
    memory: require('sails-memory-adapter')
  },
  connections: {
    default: {
      adapter: 'memory'
    }
  }
}).then(function () {
  // load other modules
  require('./other-module');
});
```

`other-module.js`

```js
var User = require('waterline-models').user;
// access the model with the value you passed to `identity` in the collection definition
User.create({
  firstName: 'Jack',
  lastName: 'Black'
});
```

# Options

### `dir`

The absolute path to the directory where your waterline collection definitions
live.

Default: `path.resolve('models')` which ends up being `process.cwd() + '/models'`

All other options are passed into waterline's `initialize` method as the
configuration which is documented
[here](https://github.com/balderdashy/waterline-docs/blob/master/introduction/getting-started.md).
