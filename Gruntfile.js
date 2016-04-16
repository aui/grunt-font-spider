'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        copy: {
            html: {
                src: './test/**',
                dest: './release/'
            },
        },

        'font-spider': {
            options: {
                backup: false,
                ignore: ['\\.woff2$']
            },
            html: {
                src: './release/**/*.html'
            }
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['copy', 'font-spider']);



};