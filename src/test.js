var fs = require('fs');
var svg2ttf = require('../lib/svg2ttf');
var ttf = svg2ttf(fs.readFileSync('/Users/tangbin/Documents/github/grunt-font-spider/dest/test/font/FZLTCXHJW--GB1-0.ttf.__temp.svg', 'utf-8'), {});
fs.writeFileSync('myfont.ttf', new Buffer(ttf.buffer));