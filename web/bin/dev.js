#!/usr/bin/env node

/*
  This script launches both the builder (in watchify mode) and the server.
  Console output from builder and server are prefixed to differentiate them.
  If either exits then this script exits.
*/

var path = require('path');
var byline = require('byline');
var colors = require('colors');
var minimist = require('minimist');
var spawn = require('child_process').spawn;

var argv = minimist(process.argv.slice(2), {
  boolean: [
  ]
});

var gulpTask = 'watch';

// the '--color' argument is intercepted by the the 'colors' node module
var gulpPath = path.join(path.join(path.dirname(require.resolve('gulp')), 'bin', 'gulp.js'));
var builder = spawn('node', [gulpPath, gulpTask, '--color']);

var server = spawn('node', [path.join(__dirname, 'server.js')])

function prefix(str, prefix) {
  var els = str.split(/\r?\n/);
  return els.join("\n"+prefix);
}

var buildPrefix = "[build] ".gray;
builder.stdout.setEncoding('utf8');
byline(builder.stdout).on('data', function(data) {
  process.stdout.write(buildPrefix + data + "\n");
});

builder.stderr.setEncoding('utf8');
byline(builder.stderr).on('data', function(data) {
  process.stderr.write(buildPrefix + data + "\n");
});

builder.on('close', function(code) {
  server.kill();
  process.exit(code);
});

var servePrefix = "[server] ".magenta;
server.stdout.setEncoding('utf8');
byline(server.stdout).on('data', function(data) {
  process.stdout.write(servePrefix + data + "\n");
});

server.stderr.setEncoding('utf8');
byline(server.stderr).on('data', function(data) {
  process.stderr.write(servePrefix + data + "\n");
});

server.on('close', function(code) {
  server.kill();
  process.exit(code);
});

