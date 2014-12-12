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

  // Though semi can be omitted in this case, it's definitly not a good coding style.
  // Two options:
  // 1. throw a warning
  // 2. do some reformat, such as replace semi with a newline?
  it('newline within multiline comment', function () {
    var src = "var a = 123;/*\n*/a++;\n"
    //expect(semi.remove(src)).to.equal(src.replace(/;/g, ''))
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

  it('should not remove semi as empty statement of if/for/while', function () {
    // if
    var src = "if (x);\n"
    expect(semi.remove(src)).to.equal(src)

    // else if
    var src = "if (x)\nelse if (x);\n"
    expect(semi.remove(src)).to.equal(src)

    // else
    var src = "if (x) x\nelse;\n"
    expect(semi.remove(src)).to.equal(src)

    // while
    var src = "while (--x);\n"
    expect(semi.remove(src)).to.equal(src)

    // for
    var src = "for (;;);\n"
    expect(semi.remove(src)).to.equal(src)

    // for...in
    var src = "for (var key in obj);\n"
    expect(semi.remove(src)).to.equal(src)
  })

  // The better coding style for these cases should be add {} ,
  // but I'm not sure whether it is the duty of this project 
  it('should not add semi for only statement of if/for/while', function () {
    // if
    var src = "if (x)\n  +x"
    expect(semi.remove(src)).to.equal(src)

    // else if
    var src = "if (x) x\nelse if (x)\n  +x"
    expect(semi.remove(src)).to.equal(src)

    // else
    var src = "if (x) x\nelse\n  +x"
    expect(semi.remove(src)).to.equal(src)
    
    // while
    var src = "while (x)\n  +x"
    expect(semi.remove(src)).to.equal(src)

    // for
    var src = "for (;;)\n  +x"
    expect(semi.remove(src)).to.equal(src)

    // for...in
    var src = "for (var key in obj)\n  +x"
    expect(semi.remove(src)).to.equal(src)

  })

  it('do...while', function () {
    // should remove semi
    var src = "do { x-- } while (x);\n"
    expect(semi.remove(src)).to.equal(src.replace(/;/g, ''))

    // should add semi
    var src = "do { x-- } while (x)\n+x"
    expect(semi.remove(src)).to.equal(src.replace(/\n/, '\n;'))
  })

  it('var statement', function () {
    // should add semi
    var src = "var x\n+x"
    expect(semi.remove(src)).to.equal(src.replace(/\n/, '\n;'))
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
