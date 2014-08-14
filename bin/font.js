#!/usr/bin/env node

'use strict';

var path = require('path');
var FontParser = require('../lib/font-parser.js');

var args = process.argv.slice(2);
var file = '../test/index.html';////debug!!!!!



if (args[0] && /^[^-]|\//.test(args[0])) {
    file = args.shift();
}


var fontparser = new FontParser({
    debug: false
});

fontparser.load(file, function (data) {
    console.log(data);
});



while (args.length > 0) {
    value = args.shift();
    switch (value) {


        // 输出目录
        case '--f':
            options.output = args.shift();
            break;

    }
}

