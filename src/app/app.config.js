angular.module('gg.app')
    .config(function($locationProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $urlRouterProvider
            .when('/', '/app')
            .when('', '/app')
            .otherwise('/', '/app')

        $stateProvider
            .state('app', {
                url: '/app',
                controller: 'AppCtrl',
                templateUrl: '/app/app.html'
            });
    })
    .run(function($rootScope, $state, $log) {
        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $log.warn('There has been an error changing states', error);
        });

        $state.go('app');
    });
