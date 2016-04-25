/**
 * Created with WebStorm.
 * User: hunt
 * Date: 4/22/16
 * Time: 4:09 PM
 * File:
 */
angular.module('gg.app')
    .controller('ProfileCtrl', function ($scope, CurrentUser, Prereqs) {
        $scope.setEditing(0);
        debugger;

        $scope.setCurrentStep({
            name: 'My Profile',
            state: 'app.profile'
        });

        //zzz
        $scope.goToEditMajors = function () {
            $scope.goToStep($scope.wizardConfig.steps[0]);
        };

        //zzz
        $scope.goToEditMinors = function () {
            $scope.goToStep($scope.wizardConfig.steps[1]);
        };

        //zzz
        $scope.goToEditCompletedCourses = function () {
            $scope.goToStep($scope.wizardConfig.steps[2]);
        };
        
    });