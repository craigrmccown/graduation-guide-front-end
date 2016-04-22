angular.module('gg.app')
    .controller('AppCtrl', function($scope, $state, CurrentUser, Notifications) {
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
                    name: 'Tracks',
                    state: 'app.criteria.tracks',
                    transitionFrom: function() {
                        return CurrentUser.saveTracks();
                    },
                    isComplete: function() {
                        return CurrentUser.tracks.length > 0;
                    },
                    incompleteMessage: 'You must select at least one track'
                },
                {
                    order: 2,
                    name: 'Minors',
                    state: 'app.criteria.minors',
                    transitionFrom: function() {
                        return CurrentUser.saveMinors();
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
                    $state.go('app.completed');
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

        function getCurrentStep() {
            for (var i = 0; i < $scope.wizardConfig.steps.length; i ++) {
                if (!$scope.wizardConfig.steps[i].isComplete()) {
                    return i == 0 ? $scope.wizardConfig.steps[0] : $scope.wizardConfig.steps[i - 1];
                }
            }

            return $scope.wizardConfig.steps[$scope.wizardConfig.steps.length - 1];
        }

        $scope.currentStep = getCurrentStep();
        $state.go($scope.currentStep.state);

    });
