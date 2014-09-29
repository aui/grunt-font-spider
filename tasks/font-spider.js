'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var font = require('../src/font');


module.exports = function(grunt) {

    grunt.registerMultiTask('font-spider', 'Optimize fonts with Grunt', function() {
        
        var that = this;
        var debug = grunt.option('debug');
        var options = this.options({

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

            new font.Spider(f.src, function (data) {
                
                data.forEach(function (item) {

                    // 忽略的字体
                    if (options.ignore.indexOf(item.name) !== -1) {
                        return;
                    }

                    var includeChars = '';
                    var chars = item.chars;

                    
                    if (typeof options.chars === 'string') {
                        includeChars = options.chars
                    } else if (typeof options.chars === 'object') {
                        includeChars = options.chars[item.name];
                    }


                    // 除重
                    includeChars.split('').forEach(function (char) {
                        if (item.chars.indexOf(char) === -1) {
                            chars += char;
                        }
                    }); 


                    var src;
                    item.files.forEach(function (file) {
                        var extname = path.extname(file).toLocaleLowerCase();

                        if (extname === '.ttf') {
                            src = file;
                        }
                        
                    });


                    if (!src) {
                        grunt.fail.warn('".ttf" file not found.');
                        return;
                    }

                    
                    var dest = src;
                    var dirname = path.dirname(dest);
                    var extname = path.extname(dest);
                    var basename = path.basename(dest, extname);
                    var out = path.join(dirname, basename);
                    var stat = fs.statSync(src);

                    

                    var fontOptimizer = new font.Optimizer(src);
                    var result = fontOptimizer.minify(dest, chars);
                    

                    if (result.code !== 0) {
                        var err = new Error('Error.');
                        grunt.log.warn(result.output);
                        grunt.fail.warn(err);
                    } else {

                        grunt.log.writeln('Font name: ' + item.name);
                        grunt.log.writeln('Include chars: ' + chars.replace(/[\n\r\t]/g, ''));
                        grunt.log.writeln('Original size: ' + (stat.size / 1000 + ' kB').green);
                        
                        if (grunt.option('stack')) {
                            // subset.pl doesn't always fail completely, for example on
                            // fsType 4 error. So we'll assume these errors are just
                            // warnings and let the user decide what to do.
                            grunt.log.writeln(grunt.log.wordlist([result.output], {color: 'yellow'}));
                        }


                        var size = fs.statSync(dest).size / 1000;
                        grunt.log.writeln('File ' + path.relative('./', dest).cyan + ' created: ' + (size + ' kB').green);

                        var fontConvertor = new font.Convertor(dest);

                        item.files.forEach(function (file) {
                            
                            var extname = path.extname(file).toLocaleLowerCase();
                            var type = extname.replace('.', '');

                            if (type === 'ttf') {
                                return;
                            }
                            
                            if (typeof fontConvertor[type] === 'function') {
                                fontConvertor[type](file);
                                var size = fs.statSync(file).size / 1000;
                                grunt.log.writeln('File ' + path.relative('./', file).cyan + ' created: ' + (size + ' kB').green);
                            } else {
                                grunt.log.warn('File ' + path.relative('./', file) + ' not created.');
                            }
                            
                        });

                    }

                    
                });

                done();
            }, debug);
            
            
            return f;
        });
    });

};
