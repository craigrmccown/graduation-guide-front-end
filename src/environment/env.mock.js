'use strict'

angular.module('gg.config', [])
    .factory('Environment', function() {
        return {
            name: 'mock',
            path: 'http://graduation-guide-api.herokuapp.com'
        }
    });
