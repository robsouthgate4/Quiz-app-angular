
var app = angular.module('quizApp', ['ngAnimate']);

app.controller('MainCtrl', [function(){
	var self = this;
}]);

//app.controller('QuizCtrl', ['quizData', function(quizData){
//
//	var self = this;
//	self.carousel = document.getElementById('carousel-example-generic');
//	self.start = false;
//	self.selectedIndex = null;
//	self.nextHidden = true;
//	self.points = null;
//	self.feedbackArray = [];
//	self.count = 0;
//	self.total = 0;
//	self.feedback = null;
//
//	quizData.getQuestions()
//		.success(function(data){
//			self.questions = data.questionset;
//			$('.carousel').carousel({
//		        interval: false
//		    });
//		}).error(function(){
//			alert("Error getting data");
//		});
//
//	self.startQuiz = function(){
//		self.start = true;
//	}
//	self.itemClicked = function($index){
//		self.selectedIndex = $index;
//		self.nextHidden = false;
//
//		for ( var i = 0; i < self.questions.length; i++) {
//			self.questions[i].selected = false;
//		 	self.points =  $index + 1;
//		}
//		self.questions[$index].selected = true;
//	}
//	self.buildFeedback = function(){
//		self.count ++;
//		self.selectedIndex = null;
//		self.feedbackArray.push(self.points);
//		console.log(self.feedbackArray);
//		if (self.count == self.questions.length) {
//			self.setFeedback();
//		}
//	}
//	self.setFeedback = function() {
//		var endPoints = self.feedbackArray;
//		self.total = 0;
//
//		$.each(endPoints, function(){
//			self.total += this;
//		});
//
//		if ( self.total >= 4 && self.total <= 8 ) {
//			self.feedback = 'first';
//		} else if (self.total > 8 && self.total <= 8) {
//			self.feedback = 'second';
//		} else {
//			self.feedback = 'third';
//		}
//	}
//	self.restartQuiz = function() {
//		$('.carousel').carousel(0);
//		$('.carousel').on('slid.bs.carousel', function(){
//			self.feedback = null;
//		});
//		self.count = 0;
//		self.total = 0;
//		self.feedbackArray.length = 0;
//	}
//
//}]);

app.factory('quizData', ['$http', function($http){
	return {
		getQuestions: function() {
			data = $http.get('data.json');
			return data;
		}
	}
}]);

app.directive('quizSlider', ['quizData', function(quizData){
    var uniqueId = 1;
    return {
        templateUrl: 'quiz.html',
        restrict: 'AE',
        scope: {

        },
        link: function($scope, $element, $attrs) {

            console.log($element);
            console.log($attrs);

            $scope.start = false;
            $scope.selectedIndex = null;
            $scope.nextHidden = true;
            $scope.points = null;
            $scope.feedbackArray = [];
            $scope.count = 0;
            $scope.total = 0;
            $scope.feedback = null;
            $scope.uniqueId = '-item' + uniqueId++;

            quizData.getQuestions()
                .success(function(data){
                    $scope.questions = data.questionset;
                    $('.carousel').carousel({
                        interval: false
                    });
                }).error(function(){
                    alert("Error getting data");
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