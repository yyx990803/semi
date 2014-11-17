var expect = require('chai').expect
var semi = require('../index')

describe('Remove', function () {

  it('eof', function () {
    var src = 'var a = 123;'
    expect(semi.remove(src)).to.equal('var a = 123')
  })

  it('newline', function () {
    var src = "var a = 123;\na++;\n"
    expect(semi.remove(src)).to.equal('var a = 123\na++\n')
  })

  it('directive', function () {
    var src = '"use strict";\nvar b = 1'
    expect(semi.remove(src)).to.equal('"use strict"\nvar b = 1')
  })

  it('multiple', function () {
    var src = "var a = b;;;;;;"
    expect(semi.remove(src)).to.equal('var a = b')
  })

  it('inline semi before ending brace', function () {
    var src = 'defer(function () { cb.call(ctx); }, 0);'
    expect(semi.remove(src)).to.equal('defer(function () { cb.call(ctx) }, 0)')
  })

  it('add newline semi for special initials', function () {
    // +
    var src = "var a = 1;\n  \n++b"
    expect(semi.remove(src)).to.equal('var a = 1\n  \n;++b')
    // -
    var src = "var a = 1;\n  \n--b"
    expect(semi.remove(src)).to.equal('var a = 1\n  \n;--b')
    // [
    var src = "a++;\n[1,2,3].forEach()"
    expect(semi.remove(src)).to.equal('a++\n;[1,2,3].forEach()')
    // (
    var src = "a++;\n(function () {})()"
    expect(semi.remove(src)).to.equal('a++\n;(function () {})()')
    // regex literal
    var src = "a++;\n/a/.test(b)"
    expect(semi.remove(src)).to.equal('a++\n;/a/.test(b)')
  })

})

describe('Add', function () {

  it('eof', function () {
    var src = 'var a = 123'
    expect(semi.add(src)).to.equal('var a = 123;')
  })

  it('newline', function () {
    var src = "var a = 123\na++\n"
    expect(semi.add(src)).to.equal('var a = 123;\na++;\n')
  })

  it('directive', function () {
    var src = '"use strict"\nvar b = 1'
    expect(semi.add(src)).to.equal('"use strict";\nvar b = 1;')
  })

  it('comments before newline semi', function () {
    var src = "a()\n/**\n* comments\n*/\n;[]"
    expect(semi.add(src)).to.equal('a();\n/**\n* comments\n*/\n[];')
  })

  it('move newline semi to prev line', function () {
    // +
    var src = "var a = 1\n  \n;++b"
    expect(semi.add(src)).to.equal('var a = 1;\n  \n++b;')
    // -
    var src = "var a = 1\n  \n;--b"
    expect(semi.add(src)).to.equal('var a = 1;\n  \n--b;')
    // [
    var src = "a++\n;[1,2,3].forEach()"
    expect(semi.add(src)).to.equal('a++;\n[1,2,3].forEach();')
    // (
    var src = "a++\n;(function () {})()"
    expect(semi.add(src)).to.equal('a++;\n(function () {})();')
    // regex literal
    var src = "a++\n;/a/.test(b)"
    expect(semi.add(src)).to.equal('a++;\n/a/.test(b);')
  })

})