angular.module('gg.app')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.criteria', {
                url: '',
                controller: 'CriteriaCtrl',
                templateUrl: '/app/criteria/views/criteria.html',
                abstract: true
            })
            .state('app.criteria.majors', {
                url: '/majors',
                controller: 'CriteriaMajorsCtrl',
                templateUrl: '/app/criteria/views/criteria.majors.html',
                resolve: {
                    'Majors': function(Major) {
                        return Major.getAll();
                    }
                }
            })
            .state('app.criteria.tracks', {
                url: '/tracks',
                controller: 'CriteriaTracksCtrl',
                templateUrl: '/app/criteria/views/criteria.tracks.html'
            })
            .state('app.criteria.minors', {
                url: '/minor',
                controller: 'CriteriaMinorsCtrl',
                templateUrl: '/app/criteria/views/criteria.minors.html',
                resolve: {
                    'Minors': function(Minor) {
                        return Minor.getAll();
                    }
                }
            });
    });
