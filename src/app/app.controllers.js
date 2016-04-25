angular.module('gg.app')
    .controller('AppCtrl', function($scope, $window, $state, CurrentUser, Notifications) {
        $scope.$state = $state;

        /* if already onboarded just send to their profile view */
        $scope.isUserOnboarded = CurrentUser.majors && CurrentUser.majors.length;
        //zz
        $scope.editing = false;
        $scope.setEditing = function (isEditing) {
            $scope.editing = !!isEditing;
        };
        //zz lol this is new
        $scope.saveHandler = null;
        $scope.setSaveHandler = function (saveHandler) {
            $scope.saveHandler = saveHandler;
        };
        $scope.saveProfile = function () {
            if ($scope.saveHandler) {
                $scope.saveHandler();
            }
        };

        $scope.CurrentUser = CurrentUser;

        var userProfileCfg = {
            name: 'My Profile',
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
                    name: 'Completed Courses',
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

        $scope.setCurrentStep = function (step) {
            $scope.currentStep = step;
        };

        $scope.goToCourseCritique = function (course, $event) {
            if (course) {
                var courseSlug = course.name.replace(/\s+/g, '');
                $window.open('https://critique.gatech.edu/course.php?id=' + courseSlug, '_blank');
            }

            $event.stopPropagation();
        };

        $scope.goToProfile = function () {
            $scope.currentStep = userProfileCfg;
            $state.go($scope.currentStep.state);
        };


        $scope.goToStep = function(step) {
            if (!$scope.stepIsAvailable(step)) {
                notifyIncomplete();
                return;
            }

            function goStep(step) {
                $scope.currentStep = step;
                $state.go(step.state);
            }

            //zzz
            if ($scope.isUserOnboarded) {
                goStep(step);
            } else {
                $scope.withErrorNotification(
                    $scope.currentStep.transitionFrom(),
                    goStep(step)
                );
            }
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

        function initCurrStep() {
            if (!$scope.currentStep) {

                $scope.currentStep = $scope.isUserOnboarded
                    ? userProfileCfg
                    : getCurrentWizardStep();
            }

        }

        $scope.currentStep = $scope.isUserOnboarded ? userProfileCfg : getCurrentWizardStep();
        $state.go($scope.currentStep.state);
    });
