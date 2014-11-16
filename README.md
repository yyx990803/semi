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