/**
 * Created with WebStorm.
 * User: hunt
 * Date: 4/22/16
 * Time: 4:09 PM
 * File:
 */
angular.module('gg.app')
    .config(function($stateProvider) {
        $stateProvider
            .state('app.profile', {
                url: '',
                controller: 'ProfileCtrl',
                templateUrl: '/app/profile/views/profile.html'
            });
    });