# csob-txt

A small utility parser for ČSOB bank statement text format.

## Installation

```js
npm install csob-txt
```

## Usage

```js
var fs = require('fs');
var csobTxtParser = require('csob-txt').parser;

var source = fs.createReadStream('./test.txt');
source
    .pipe(csobTxtParser)
    .on('data',function(data) {
        ...
});
```



