angular.module('gg.app')
    .config(function($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $urlRouterProvider
            .when('/', '/app')
            .when('/app/', '/app')
            .when('', '/app')
            .otherwise('/app');

        $urlMatcherFactoryProvider.strictMode(false);

        $stateProvider
            .state('app', {
                url: '/app',
                controller: 'AppCtrl',
                templateUrl: '/app/app.html',
                abstract: true,
                resolve: {
                    'CurrentUser': function(User) {
                        return User.getCurrent();
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: '/app/login/views/login.html',
                controller: 'LoginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: '/app/register/views/register.html',
                controller: 'RegisterCtrl'
            });

        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;

        $httpProvider.interceptors.unshift(['$q', '$rootScope', function($q, $rootScope) {
            return {
                request: function(response) {
                    return response;
                },
                responseError: function(response) {
                    switch(response.status) {
                        case 401:
                            $rootScope.$emit('auth.loginRequired');
                            break;
                    }

                    return $q.reject(response);
                }
            };
        }]);
    })
    .run(function($rootScope, $log, $state, Notifications) {
        $rootScope.notifications = Notifications;

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $log.warn('There has been an error changing states', error);
            $state.go('app.error', { error: error.stack });
        });

        $rootScope.$on('auth.loginRequired', function() {
            $state.go('login');
        })

        $rootScope.$on('notification.success', function(event, message) {
            Notifications.notifySuccess(message, 3000);
        });
        
        $rootScope.$on('notification.error', function(event, message) {
            message = message || 'There has been an error. Please refresh your page and try again';
            Notifications.notifyError(message, 3000);
        });

        $rootScope.withErrorNotification = function(promise, callback, message) {
            promise.success(callback).error(
                function() {
                    $rootScope.$emit('notification.error', message);
                }
            );
        }
    });
