'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var shell = require('shelljs');

var Optimizer = function (ttfFile) {

    if (path.extname(ttfFile).toLocaleLowerCase() !== '.ttf') {
        throw "Only accept .ttf file";
    }

    this._ttf = ttfFile;
};

Optimizer.prototype.minify = function (dest, chars) {

    var src = this._ttf;
    var temp = dest + '.__temp';// 如果 src === dest，生成的字体格式会损坏，这应该是 font-optimizer 库的问题

    // Features to include.
    // - Use "none" to include no features.
    // - Leave array empty to include all features.
    // See list of all features:
    // http://en.wikipedia.org/wiki/OpenType_feature_tag_list#OpenType_typographic_features
    var includeFeatures = ['kern'];


    // Save old path so we can cwd back into it
    var oldCwd = path.resolve(".");
    shell.cd(path.join(__dirname, "../lib/font-optimizer/"));

    // build execution command
    var cmd = [];
    cmd.push("perl -X ./subset.pl"); // Main executable
    cmd.push(util.format('--chars="%s"', chars.replace(/([^\w])/g, function(r) { return "\\"+r; }))); // Included characters
    if (includeFeatures.length !== 0) {
        // Included font features
        cmd.push("--include=" + includeFeatures.join(","));
    }
    cmd.push('"' + src + '"');
    cmd.push('"' + temp + '"');
    cmd = cmd.join(" ");
    
    var result = shell.exec(cmd, {silent: true});

    if (result.code !== 0) {
        // Error
    } else {

        // subset.pl doesn't always fail completely, for example on
        // fsType 4 error. So we'll assume these errors are just
        // warnings and let the user decide what to do.

        // result.output

        fs.renameSync(temp, dest);
    }

    shell.cd(oldCwd);

    return result;
};

module.exports = Optimizer;
