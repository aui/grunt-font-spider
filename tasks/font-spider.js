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
            debug: debug
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


            new FontSpider(f.src, options)
            .then(done, function (e) {
                grunt.log.warn(e.message);
                grunt.fail.fatal(e); 
            });
            
            return f;
        });
    });

};
