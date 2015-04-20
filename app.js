
var app = angular.module('quizApp', ['ngAnimate']);

app.controller('MainCtrl', [function(){
	var self = this;
}]);

app.factory('quizDataOne', ['$http', function($http){
	return {
		getQuestions: function() {
			data = $http.get('data.json');
			return data;
		}
	}
}]);

app.factory('quizDataTwo', ['$http', function($http){
    return {
        getQuestions: function() {
            data = $http.get('dataTwo.json');
            return data;
        }
    }
}]);

app.directive('quizSlider', [function(){
    var uniqueId = 1;
    return {
        templateUrl: 'quiz.html',
        restrict: 'AEC',
        scope: {
            factoryName : '@'
        },
        link: function($scope, $element, $attrs) {

            $scope.start = false;
            $scope.selectedIndex = null;
            $scope.nextHidden = true;
            $scope.points = null;
            $scope.feedbackArray = [];
            $scope.count = 0;
            $scope.total = 0;
            $scope.feedback = null;
            $scope.uniqueId = '-item' + uniqueId++;

            var factoryInstance = $element.injector().get($scope.factoryName);

            // Receive data from factory that is specified with html
            factoryInstance.getQuestions()
                .success(function(data){
                    $scope.questions = data.questionset;
                }).error(function(){
                    alert("Error getting data");
                });
            
            $('.carousel').carousel({
                interval: false
            });

            $scope.startQuiz = function(){
                $scope.start = true;
            };
            $scope.itemClicked = function($index){
                $scope.selectedIndex = $index;
                $scope.nextHidden = false;

                for ( var i = 0; i < $scope.questions.length; i++) {
                    $scope.questions[i].selected = false;
                    $scope.points =  $index + 1;
                }

                $scope.questions[$index].selected = true;
            };
            $scope.buildFeedback = function(){
                $scope.count ++;
                $scope.selectedIndex = null;
                $scope.feedbackArray.push($scope.points);
                if ($scope.count == $scope.questions.length) {
                    $scope.setFeedback();
                }
            };
            $scope.setFeedback = function() {
                var endPoints = $scope.feedbackArray;
                $scope.total = 0;

                //$.each(endPoints, function(){
                //    $scope.total += this;
                //});

                for ( var i = 0; i < endPoints.length; i++ ) {
                    $scope.total += endPoints[i];
                }

                if ( $scope.total >= 4 && $scope.total <= 8 ) {
                    $scope.feedback = 'first';
                } else if ($scope.total > 8 && $scope.total <= 8) {
                    $scope.feedback = 'second';
                } else {
                    $scope.feedback = 'third';
                }
            };
            $scope.restartQuiz = function() {
                $('.carousel').carousel(0);
                $('.carousel').on('slid.bs.carousel', function(){
                    $scope.feedback = null;
                });
                $scope.count = 0;
                $scope.total = 0;
                $scope.feedbackArray.length = 0;
            }

        }
    }
}]);