'use strict';

var path = require('path');
var FontSpider = require('font-spider');
var colors = require('colors/safe');


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

                        grunt.log.writeln('Font family:', colors.green(webFont.family));
                        grunt.log.writeln('Original size:', colors.green(webFont.originalSize / 1000 + ' KB'));
                        grunt.log.writeln('Include chars:', webFont.chars);
                        grunt.log.writeln('Font id:', webFont.id);
                        grunt.log.writeln('CSS selector:', webFont.selectors.join(', '));
                        grunt.log.writeln('Font files:');

                        webFont.files.forEach(function(file) {
                            if (grunt.file.exists(file.source)) {
                                grunt.log.writeln('File', colors.cyan(path.relative('./', file.source)),
                                    'created:', colors.green(file.size / 1000 + ' KB'));
                            } else {
                                grunt.log.writeln(colors.red('File ' + path.relative('./', file.source) + ' not created'));
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