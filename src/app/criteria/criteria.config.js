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
            .state('app.criteria.minors', {
                url: '/minor',
                controller: 'CriteriaMinorsCtrl',
                templateUrl: '/app/criteria/views/criteria.minors.html',
                resolve: {
                    'Minors': function(Minor) {
                        return Minor.getAll();
                    }
                }
            })
            .state('app.criteria.completed', {
                url: '/completed',
                controller: 'CriteriaCompletedCtrl',
                templateUrl: '/app/criteria/views/criteria.completed.html',
                resolve: {
                    'CompletedCourses': function(Course) {
                        return Course.getAll();
                    }
                }
            });
    });
