'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var FontSpider = require('../src/font-spider.js');
var fontOptimizer = require('../src/font-optimizer.js');
var FontConvertor = require('../src/font-convertor.js');

module.exports = function(grunt) {

    grunt.registerMultiTask('font-spider', 'Optimize fonts with Grunt', function() {
        
        var that = this;
        var debug = grunt.option('debug');
        var options = this.options({

            // 忽略的字体名称
            ignore: [],

            // 额外添加的字符
            chars: '',

            // Features to include.
            // - Use "none" to include no features.
            // - Leave array empty to include all features.
            // See list of all features:
            // http://en.wikipedia.org/wiki/OpenType_feature_tag_list#OpenType_typographic_features
            includeFeatures: ['kern']
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

            var fontSpider = new FontSpider({
                debug: debug
            });


            fontSpider.load(f.src, function (data) {


                data.forEach(function (item) {

                    if (options.ignore.indexOf(item.name) !== -1) {
                        return;
                    }

                    var chars = item.chars;

                    options.chars.split('').forEach(function (char) {
                        if (item.chars.indexOf(char) === -1) {
                            chars += char;
                        }
                    });

                    var src;
                    item.files.forEach(function (file) {
                        if (path.extname(file).toLocaleLowerCase() === '.ttf') {
                            src = file;
                        }
                    });

                    if (!src) {
                        grunt.log.warn('".ttf" file not found.');
                        return;
                    }
                    
                    var dest = src;
                    var relativeDestination = path.relative('./', dest);
                    var dirname = path.dirname(dest);
                    var extname = path.extname(dest);
                    var basename = path.basename(dest, extname);
                    var out = path.join(dirname, basename);
                    var stat = fs.statSync(src);

                    fontOptimizer({
                        chars: chars,
                        src: src,
                        dest: dest,
                        includeFeatures: options.includeFeatures
                    }, function (result) {

                        //grunt.log.writeln('Font ' + item.name);
                        //grunt.log.writeln('Chars ' + chars.length);

                        if (result.code !== 0) {
                            var err = new Error('Error.');
                            grunt.log.warn(result.output);
                            grunt.fail.warn(err);
                        } else {
                            
                            if (grunt.option('stack')) {
                                // subset.pl doesn't always fail completely, for example on
                                // fsType 4 error. So we'll assume these errors are just
                                // warnings and let the user decide what to do.
                                grunt.log.writeln(grunt.log.wordlist([result.output], {color: 'yellow'}));
                            }


                            var oldSize = stat.size / 1000;
                            var newSize = fs.statSync(dest).size / 1000;

                            grunt.log.writeln('File ' + relativeDestination + ' created: ' + oldSize + ' kB → ' + newSize + ' kB');

                            var fontConvertor = new FontConvertor(dest);

                            fontConvertor.toEot(out + '.eot');
                            newSize = fs.statSync(out + '.eot').size / 1000;
                            grunt.log.writeln('File ' + path.relative('./', out + '.eot') + ' created: ' + oldSize + ' kB → ' + newSize + ' kB');

                            fontConvertor.toWoff(out + '.woff');
                            newSize = fs.statSync(out + '.woff').size / 1000;
                            grunt.log.writeln('File ' + path.relative('./', out + '.woff') + ' created: ' + oldSize + ' kB → ' + newSize + ' kB');
                            
                            // fontConvertor.toSvg(out + '.svg');
                            // grunt.log.writeln('File ' + path.relative('./', out + '.svg') + ' created.');

                        }

                        done();
                    });
                    

                });


            });
            

            
            return f;
        });
    });

};
