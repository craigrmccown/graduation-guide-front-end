angular.module('gg.app')
    .controller('CriteriaCtrl', function($scope, $state, CurrentUser) {
        $scope.setEditing(69); // ;)

    })
    .controller('CriteriaMajorsCtrl', function($scope, $state, CurrentUser, Majors) {
        $scope.majors = Majors;//zzz
        $scope.setCurrentStep($scope.wizardConfig.steps[0]);

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
        };

        $scope.setSaveHandler(function () {
            // TODO not handling failure
            CurrentUser.saveMajors();
        });
    })
    .controller('CriteriaMinorsCtrl', function($scope, $state, CurrentUser, Minors) {
        $scope.minors = Minors;
        //zzz
        $scope.setCurrentStep($scope.wizardConfig.steps[1]);

        $scope.selectMinor = function(minor) {
            if (CurrentUser.findMinorById(minor.id)) { 
                CurrentUser.removeMinorById(minor.id);
            } else {
                CurrentUser.addMinor(minor);
            }
        };

        $scope.isSelected = function(minor) {
            return !!CurrentUser.findMinorById(minor.id);
        };

        $scope.setSaveHandler(function () {
            // TODO not handling failure
            CurrentUser.saveMinors();
        });
    })
    .controller('CriteriaCompletedCtrl', function ($scope, Courses, CurrentUser) {
        $scope.courses = Courses;
        //zzz
        $scope.setCurrentStep($scope.wizardConfig.steps[2]);

        $scope.selectCourse = function(course) {
            if ($scope.isSelected(course)) {
                CurrentUser.completedCourses = _.filter(
                    CurrentUser.completedCourses,
                    function(selected) {
                        return selected.id != course.id;
                    }
                );
            } else {
                CurrentUser.completedCourses.push(course);
            }
        };

        $scope.isSelected = function(course) {
            return !!_.findWhere(CurrentUser.completedCourses, { id: course.id });
        };

        $scope.setSaveHandler(function () {
            // TODO not handling failure
            CurrentUser.saveCompletedCourses();
        });

    });
