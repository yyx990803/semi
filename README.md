# Semi

> To semicolon or not to semicolon; that is the question

Add/remove semicolons from your JavaScript. Because style.

## Usage

### CLI

``` bash
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