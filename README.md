# Semi [![npm version](https://badge.fury.io/js/semi.svg)](http://badge.fury.io/js/semi) [![Build Status](https://travis-ci.org/yyx990803/semi.svg?branch=master)](https://travis-ci.org/yyx990803/semi)

> To semicolon or not to semicolon; that is the question

Add/remove semicolons from your JavaScript.

## Why???

Because style.

On a more serious note, you should read this execellent post on [JavaScript Semicolon Insertion](http://inimino.org/~inimino/blog/javascript_semicolons). Writing JavaScript without semicolons is totally viable and (at least for me) is a big productivity boon.

This little tool can add semicolons to files written in a semicolon-less style, and can also remove semicolons from those written with semicolons. This allows you to write code in the style you like and just auto convert it when you are ready to commit your code into a codebase with a different style requirement.

It is implemented by [hacking jshint](https://github.com/yyx990803/jshint/commit/e7bb51d7f5e72db2ce98cd76d8657937dac498e5), and 100% preserves your original code formatting (other than semicolons). It even takes care of special cases where a newline semicolon is needed (see below).

## Usage

### CLI

``` bash
npm install -g semi
# if no --out is specified will overwrite original
semi [add|remove] <glob> [--out dir]
```

### API

``` js
var semi = require('semi')
// semi.add(<String>)
var jsWithSemicolons = semi.add(jsWithoutSemicolons)
// semi.remove(<String>)
var jsWithoutSemicolons = semi.remove(jsWithSemicolons)
```

## Special Cases

Semi will automatically convert between the following two cases (also for newlines that start with `[`, `+`, `-` or a regex literal):

``` js
// A
var a = b;
(function () {
  /* ... */
})()
// B
var a = b
;(function () {
  /* ... */
})()
```

However, it will not do anyting to the following, because there's no way for Semi to tell if you actually wanted to write it like this or not.

``` js
var a = b
(functon () {
  /* ... */
})()
```