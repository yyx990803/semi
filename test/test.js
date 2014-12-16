var expect = require('chai').expect
var semi = require('../index')

var testCases = {

  remove: {

    'eof': [
      'var a = 123;',
      'var a = 123'
    ],

    'newline': [
      'var a = 123;\na++;\n',
      'var a = 123\na++\n'
    ],

    'newline within multiline comment': [
      'var a = 123;/*\n*/a++;\n',
      'var a = 123/*\n*/a++\n'
    ],

    'directive': [
      '"use strict";\nvar b = 1',
      '"use strict"\nvar b = 1'
    ],

    'multiple': [
      'var a = b;;;;;;',
      'var a = b'
    ],

    'inline semi before ending brace': [
      'defer(function () { cb.call(ctx); }, 0);',
      'defer(function () { cb.call(ctx) }, 0)'
    ],

    'should not remove same line statements': [
      'a++;;; b++;',
      'a++; b++'
    ],

    'sepcial newlines': [
      // +
      [
        'var a = 1;\n  \n++b',
        'var a = 1\n  \n;++b'
      ],
      // -
      [
        'var a = 1;\n  \n--b',
        'var a = 1\n  \n;--b'
      ],
      // [
      [
        'a++;\n[1,2,3].forEach()',
        'a++\n;[1,2,3].forEach()'
      ],
      // (
      [
        'a++;\n(function () {})()',
        'a++\n;(function () {})()'
      ],
      // /
      [
        'a++;\n/a/.test(b)',
        'a++\n;/a/.test(b)'
      ]
    ],

    'should not remove semi as empty statement of if/for/while': [
      // if
      [
        'if (x);\n',
        'if (x);\n'
      ],
      // else if
      [
        'if (x);else if (x);\n',
        'if (x);else if (x);\n'
      ],
      // else
      [
        'if (x) x\nelse;\n',
        'if (x) x\nelse;\n'
      ],
      // while
      [
        'while (--x);\n',
        'while (--x);\n'
      ],
      // for
      [
        'for (;;);\n',
        'for (;;);\n'
      ],
      // for...in
      [
        'for (var key in obj);\n',
        'for (var key in obj);\n'
      ]
    ],

    'should not add semi for only statement of if/for/while': [
      // if
      [
        'if (x)\n  +x',
        'if (x)\n  +x'
      ],
      // else if
      [
        'if (x) x\nelse if (x)\n  +x',
        'if (x) x\nelse if (x)\n  +x'
      ],
      // else
      [
        'if (x) x\nelse\n  +x',
        'if (x) x\nelse\n  +x'
      ],
      // while
      [
        'while (x)\n  +x',
        'while (x)\n  +x'
      ],
      // for
      [
        'for (;;)\n  +x',
        'for (;;)\n  +x'
      ],
      // for...in
      [
        'for (var key in obj)\n  +x',
        'for (var key in obj)\n  +x'
      ]
    ],

    'do...while': [
      'do { x-- } while (x);\n',
      'do { x-- } while (x)\n'
    ],

    // special case. do we really need these?

    // 'do...while add': [
    //   'do { x-- } while (x)\n+x',
    //   'do { x-- } while (x)\n;+x'
    // ],
    // 
    // 'var statement': [
    //   'var x\n+x',
    //   'var x\n;+x'
    // ]
  },

  add: {

    'eof': [
      'var a = 123',
      'var a = 123;'
    ],

    'newline': [
      'var a = 123\na++\n',
      'var a = 123;\na++;\n'
    ],

    'directive': [
      '"use strict"\nvar b = 1',
      '"use strict";\nvar b = 1;'
    ],

    'comments before newline semi': [
      'a()\n/**\n* comments\n*/\n;[]',
      'a();\n/**\n* comments\n*/\n[];'
    ],

    'before ending brace': [
      'function a (x) { x++ }',
      'function a (x) { x++; }'
    ],

    'do...while': [
      'do { x-- } while (x)\n++x',
      'do { x--; } while (x);\n++x;'
    ],

    'move newline semi to prev line': [
      // +
      [
        'var a = 1\n  \n;++b',
        'var a = 1;\n  \n++b;'
      ],
      // -
      [
        'var a = 1\n  \n;--b',
        'var a = 1;\n  \n--b;'
      ],
      // [
      [
        'a++\n;[1,2,3].forEach()',
        'a++;\n[1,2,3].forEach();'
      ],
      // (
      [
        'a++\n;(function () {})()',
        'a++;\n(function () {})();'
      ],
      // /
      [
        'a++\n;/a/.test(b)',
        'a++;\n/a/.test(b);'
      ]
    ]
  }
  
}

function suite (name) {
  describe(name, function () {
    Object.keys(testCases[name]).forEach(function (desc) {
      var tests = testCases[name][desc]
      var assert = function (test) {
        var src = test[0]
        var expected = test[1]
        expect(semi[name](src)).to.equal(expected)
      }
      it(desc, function () {
        if (Array.isArray(tests[0])) {
          tests.forEach(assert)
        } else {
          assert(tests)
        }
      })
    })
  })
}

suite('remove')
suite('add')