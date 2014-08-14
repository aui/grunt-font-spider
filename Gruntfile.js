'use strict';



module.exports = function(grunt) {



  // Project configuration.
  grunt.initConfig({

    copy: {
      main: {
        src: './test/**',
        dest: './dest/'
      },
    },

    'font-spider': {
      main: {
        src: './dest/test/**/*.html'
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy', 'font-spider']);



};