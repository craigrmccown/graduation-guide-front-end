'use strict'

angular.module('gg.config', [])
    .factory('Environment', function() {
        return {
            name: 'dev',
            path: 'http://graduation-guide-api.herokuapp.com'
        }
    });
