'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var FontSpider = require('font-spider');

module.exports = function(grunt) {

    grunt.registerMultiTask('font-spider', 'Optimize fonts with Grunt', function() {
        
        var that = this;
        var debug = grunt.option('debug');
        var options = this.options({

            debug: debug,

            // 忽略的字体名称
            ignore: [],

            // 额外添加的字符
            chars: ''

        });
        

        this.files.forEach(function(f) {
            

            // Filter non-existing sources
            f.src.filter(function(filepath) {
                if (!grunt.file.exists()) {
                    grunt.log.warn('Source file "' + f.src + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });
            

            // Don't proceed if no files found
            if(f.src.length === 0) {
                return f;
            }

            var done = that.async();


            var fontspider = new FontSpider(f.src, options);

            fontspider.onoutput = function (data) {
                grunt.log.writeln('Font name: ' + (data.fontName).cyan);
                grunt.log.writeln('CSS Selectors: ' + data.selectors);
                grunt.log.writeln('Include chars: ' + data.includeChars);
                grunt.log.writeln('Original size: ' + (data.originalSize / 1000 + ' KB').green);
                data.output.forEach(function (item) {
                    grunt.log.writeln('File ' + (item.file).cyan + ' created: ' + (item.size / 1000 + ' kB').green)
                });
            };

            fontspider.onend = function () {
                done();
            };

            fontspider.onerror = function (e) {
                grunt.log.warn(e.message);
                grunt.fail.fatal(e);
            }

            fontspider.start();
            
            return f;
        });
    });

};
