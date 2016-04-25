angular.module('gg.app')
    .controller('CriteriaCtrl', function($scope, $state, CurrentUser) {


    })
    .controller('CriteriaMajorsCtrl', function($scope, $state, CurrentUser, Majors) {
        $scope.majors = Majors;

        $scope.selectMajor = function(major) {
            if (CurrentUser.findMajorById(major.id)) {
                CurrentUser.removeMajorById(major.id);
            } else {
                CurrentUser.addMajor(major);
            }
        };

        $scope.isSelected = function(major) {
            return !!CurrentUser.findMajorById(major.id);
        };

        $scope.selectTrack = function(track) {
            if (CurrentUser.findTrackById(track.id)) {
                CurrentUser.removeTrackById(track.id);
            } else {
                CurrentUser.addTrack(track);
            }
        };

        $scope.isTrackSelected = function(track) {
            return !!CurrentUser.findTrackById(track.id);
        }
    })
    .controller('CriteriaMinorsCtrl', function($scope, $state, CurrentUser, Minors) {
        $scope.minors = Minors;

        $scope.selectMinor = function(minor) {
            if (CurrentUser.findMinorById(minor.id)) { 
                CurrentUser.removeMinorById(minor.id);
            } else {
                CurrentUser.addMinor(minor);
            }
        };

        $scope.isSelected = function(minor) {
            return !!CurrentUser.findMinorById(minor.id);
        }
    })
    .controller('CriteriaCompletedCtrl', function ($scope, Courses) {
        $scope.courses = Courses;

    });
