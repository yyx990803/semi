var jshint = require('jshint-semicolon-hack').JSHINT
var offsets
var lines

jshint.addSemicolon = function (n, ch) {
  n--
  ch--
  if (offsets[n]) ch += offsets[n]
  var line = lines[n]
  lines[n] = line.slice(0, ch) + ';' + line.slice(ch)
  offset(n, 1)
}

jshint.removeSemicolon = function (n, ch) {
  n--
  ch--
  if (offsets[n]) ch += offsets[n]
  var line = lines[n]
  lines[n] = line.slice(0, ch) + line.slice(ch + 1)
  offset(n, -1)
}

function offset (n, inc) {
  if (!offsets[n]) {
    offsets[n] = 0 + inc
  } else {
    offsets[n] += inc 
  }
}

function process (buffer) {
  lines = buffer.split('\n')
  offsets = {}
  jshint(buffer)
  return lines.join('\n')
}

exports.add = function (buffer) {
  jshint.asr = false
  return process(buffer)
}

exports.remove = function (buffer) {
  jshint.asr = true
  return process(buffer)
}