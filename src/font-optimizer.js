'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var shell = require('shelljs');



module.exports = function (options, callback) {

	var chars = options.chars;
	var src = options.src;
	var dest = options.dest;
    var temp = dest + '.__temp';// 如果 src === dest，生成的字体格式会不合法，这应该是 font-optimizer 的问题
	var includeFeatures = options.includeFeatures;


	// Save old path so we can cwd back into it
	var oldCwd = path.resolve(".");
	shell.cd(path.join(__dirname, "../lib/font-optimizer/"));

    // build execution command
    var cmd = [];
    cmd.push("perl -X ./subset.pl"); // Main executable
    cmd.push(util.format('--chars="%s"', chars.replace(/([^\w])/g, function(r) { return "\\"+r; }))); // Included characters
    if(options.includeFeatures && options.includeFeatures.length !== 0) {
        // Included font features
        cmd.push("--include=" + options.includeFeatures.join(","));
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
    callback(result);
};
