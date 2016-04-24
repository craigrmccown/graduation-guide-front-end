angular.module('gg.app')
    .controller('CompletedCtrl', function($scope,$state, Courses) {
        $scope.courses = Courses;
        $scope.selectedCourses = [];

        $scope.selectCourse = function(course) {
            if ($scope.isSelected(course)) {
                $scope.selectedCourses = _.filter(
                    $scope.selectedCourses,
                    function(selected) {
                        return selected.id != course.id;
                    }
                );
            } else {
                $scope.selectedCourses.push(course);
            }
        };

        $scope.isSelected = function(course) {
            return !!_.findWhere($scope.selectedCourses, { id: course.id });
        };

        $scope.finish = function() {
             // if (!$scope.allStepsComplete()) {
             //     notifyIncomplete();
             //     return;
             // }
             $state.go('app.viewclassoptions');

            // $scope.withErrorNotification(
            //     // $scope.currentStep.transitionFrom(),
            //     function() {
            //         $state.go('app.viewclassoptions');
            //     }
            // );
        }
    });
