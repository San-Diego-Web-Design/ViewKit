#!/usr/bin/env node

var namespace = 'vk'
var jsOutput = 'build/vk.js'
var cssOutput = 'build/vk.css'

/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path');

// lib dir

var lib = 'lib/components';

// js

var js = fs.createWriteStream(jsOutput, { flags: 'a' });

// components to build

var components = process.argv.slice(2);

function next(i) {
  var name = components[i];
  if (!name) return;
  build(name, function(){
    next(++i);
  });
}

// build em!

console.log();
js.write('var ' + namespace + ' = {};\n');
next(0);
process.on('exit', function(){
  console.log();
});

/**
 * Build the given component.
 */

function build(name, fn) {
  // javascript
  var js = path.join(lib, name, name + '.js');
  read(js, function(err, js) {
    function done() {
      console.log('  \033[90mbuild \033[36m%s\033[m', name);
      fn()
    }
    if (err) return done()

    // with template
    var template = path.join(lib, name, name + '.html');
    if (fs.existsSync(template)) {
      read(template, function(err, template){
        js = '\n;(function(exports, template){\n'
          + js
          + '\n})(' + namespace + ', ' + JSON.stringify(template) + ');';
        append(jsOutput, js, done);
      });
    // without template
    } else {
      js = '\n;(function(exports){\n'
        + js
        + '\n})(' + namespace + ');';
      append(jsOutput, js, done);
    }
  });

  // style
  var css = path.join(lib, name, name + '.css');
  if (fs.existsSync(css)) {
    read(css, function(err, css){
      append(cssOutput, css);
    });
  }
}

/**
 * Append to `file`.
 */

function append(file, str, fn) {
  fs.createWriteStream(file, { flags: 'a' })
    .write(str);
  fn && fn();
}

/**
 * Read the given `file`.
 */

function read(file, fn) {
  fs.readFile(file, 'utf8', function(err, str){
    if (err) return fn(err);
    fn(false, str);
  });
}