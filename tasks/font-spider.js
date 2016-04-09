'use strict';

var fs = require('fs');
var path = require('path');
var FontSpider = require('font-spider');

module.exports = function(grunt) {

    grunt.registerMultiTask('font-spider', 'Optimize fonts with Grunt', function() {

        var that = this;
        var debug = grunt.option('debug');
        var options = this.options({
            resourceLoad: function(file) {
                var RE_SERVER = /^https?\:\/\//i;
                if (RE_SERVER.test(file)) {
                    grunt.log.writeln('Load:', file);
                }
            },
            debug: debug
        });


        this.files.forEach(function(f) {

            // Filter non-existing sources
            f.src.filter(function() {
                if (!grunt.file.exists()) {
                    grunt.log.warn('Source file "' + f.src + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });


            // Don't proceed if no files found
            if (f.src.length === 0) {
                return f;
            }

            var done = that.async();


            new FontSpider(f.src, options)
                .then(function(webFonts) {

                    webFonts.forEach(function(webFont) {

                        grunt.log.writeln('Font family:', color('green', webFont.family));
                        grunt.log.writeln('Original size:', color('green', webFont.originalSize / 1000 + ' KB'));
                        grunt.log.writeln('Include chars:', webFont.chars);
                        grunt.log.writeln('Font id:', webFont.id);
                        grunt.log.writeln('CSS selector:', webFont.selectors.join(', '));
                        grunt.log.writeln('Font files:');

                        webFont.files.forEach(function(file) {
                            file = file.toString();
                            if (grunt.file.exists(file)) {
                                grunt.log.writeln('File', color('cyan', path.relative('./', file)),
                                    'created:', color('green', +fs.statSync(file).size / 1000 + ' KB'));
                            } else {
                                grunt.log.writeln(color('red', 'File ' + path.relative('./', file) + ' not created'));
                            }
                        });

                        grunt.log.writeln('');
                    });

                    done();
                }, function(errors) {
                    grunt.log.warn(errors.message);
                    grunt.fail.fatal(errors);
                });

            return f;
        });
    });

};

function color(name, string) {
    return string[name];
}