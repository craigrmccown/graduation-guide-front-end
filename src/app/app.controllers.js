angular.module('gg.app')
    .controller('AppCtrl', function($scope, $window, $state, CurrentUser, Notifications) {
        $scope.$state = $state;

        /* if already onboarded just send to their profile view */
        //$scope.isUserOnboarded = CurrentUser.majors && CurrentUser.majors.length;
        $scope.CurrentUser = CurrentUser;

        var userProfileCfg = {
            name: 'User Profile',
            state: 'app.profile'
        };

        $scope.wizardConfig = {
            steps: [
                {
                    order: 0,
                    name: 'Majors',
                    state: 'app.criteria.majors',
                    transitionFrom: function() {
                        return CurrentUser.saveMajors();
                    },
                    isComplete: function() {
                        return CurrentUser.majors.length > 0;
                    },
                    incompleteMessage: 'You must select at least one major'
                },
                {
                    order: 1,
                    name: 'Minors',
                    state: 'app.criteria.minors',
                    transitionFrom: function() {
                        return CurrentUser.saveMinors();
                    },
                    isComplete: function() {
                        return true;
                    },
                    incompleteMessage: 'You must select at least one minor'
                },
                {
                    order: 2,
                    name: 'Courses',
                    state: 'app.criteria.completed',
                    transitionFrom: function() {
                        return CurrentUser.saveCompletedCourses();
                    },
                    isComplete: function() {
                        return true;
                    },
                    incompleteMessage: 'You must select at least one minor'
                }
            ]
        };


        $scope.stepIsAvailable = function(step) {
            for (var i = 0; i < step.order; i ++) {
                if (!$scope.wizardConfig.steps[i].isComplete()) {
                    return false;
                }
            }

            return true;
        };

        $scope.goToCourseCritique = function (course, $event) {
            if (course) {
                var courseSlug = course.name.replace(/\s+/g, '');
                $window.open('https://critique.gatech.edu/course.php?id=' + courseSlug, '_blank');
            }

            $event.stopPropagation();
        };

        $scope.goToStep = function(step) {
            if (!$scope.stepIsAvailable(step)) {
                notifyIncomplete();
                return;
            }

            $scope.withErrorNotification(
                $scope.currentStep.transitionFrom(),
                function() {
                    $scope.currentStep = step;
                    $state.go(step.state);
                }
            );
        };

        $scope.allStepsComplete = function() {
            for (var i = 0; i < $scope.wizardConfig.steps.length; i ++) {
                if (!$scope.wizardConfig.steps[i].isComplete()) {
                    return false;
                }
            }

            return true;
        };

        $scope.finish = function() {
            if (!$scope.allStepsComplete()) {
                notifyIncomplete();
                return;
            }

            $scope.withErrorNotification(
                $scope.currentStep.transitionFrom(),
                function() {
                    $state.go('app.profile');
                }
            );
        };

        function notifyIncomplete() {
            for (var i = 0; i < $scope.wizardConfig.steps.length; i ++) {
                var step = $scope.wizardConfig.steps[i];

                if (!step.isComplete() && $scope.stepIsAvailable(step)) {
                    $scope.$emit('notification.error', step.incompleteMessage);
                }
            }
        }

        function getCurrentWizardStep() {
            for (var i = 0; i < $scope.wizardConfig.steps.length; i ++) {
                if (!$scope.wizardConfig.steps[i].isComplete()) {
                    return i == 0 ? $scope.wizardConfig.steps[0] : $scope.wizardConfig.steps[i - 1];
                }
            }

            return $scope.wizardConfig.steps[$scope.wizardConfig.steps.length - 1];
        }

        $scope.currentStep = $scope.isUserOnboarded ? userProfileCfg : getCurrentWizardStep();
        $state.go($scope.currentStep.state);
    });
