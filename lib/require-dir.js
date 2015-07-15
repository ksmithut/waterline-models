'use strict';

var fs = require('fs');
var path = require('path');
var assign = require('object-assign');

module.exports = function requireDir(dir, options) {
  options = assign({
    string: false,
    camel: true,
    pascal: true,
    extension: false,
    hash: false,
    exclude: []
  }, options);

  if (options.pascal) { options.camel = true; }
  if (options.camel) { options.extension = false; }

  var files = fs.readdirSync(dir)
    .filter(exclusion(options.exclude))
    .map(function (filepath) {
      var name = filepath;
      var fullPath = path.join(dir, filepath);
      var moduleContents = options.string
        ? fs.readFileSync(fullPath, 'utf8')
        : require(fullPath);

      if (!options.extension) {
        name = path.basename(name, path.extname(name));
      }

      if (options.camel) {
        name = name
          .replace(/[^a-zA-Z0-9]/g, '-')
          .split('-')
          .map(camelcase(options.pascal))
          .join('');
      }

      return {name: name, module: moduleContents};
    });

  if (options.hash) {
    files = files.reduce(function (hash, file) {
      hash[file.name] = file.module;
      return hash;
    }, {});
  }

  return files;
};

function exclusion(exclude) {
  return function (str) {
    return exclude.indexOf(str) < 0;
  };
}

function camelcase(pascal) {
  if (pascal) { return capitalize; }
  return function (word, i) {
    if (i === 0) { return word.toLowerCase(); }
    return capitalize(word);
  };
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}
