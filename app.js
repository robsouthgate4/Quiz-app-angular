
var app = angular.module('quizApp', ['ngAnimate', 'firebase']);

app.controller('MainCtrl', [function(){
	var self = this;
}]);

app.directive('quizSlider', ['$firebaseObject', function($firebaseObject){

    var uniqueId = 1;
    var resultsRef = new Firebase("https://quiz-app.firebaseio.com/results");

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
            $scope.answerObj = {};
            $scope.resultArray = [];
            $scope.userObj = {};
            $scope.count = 0;
            $scope.total = 0;
            $scope.feedback = null;
            $scope.uniqueId = '-item' + uniqueId++;

            var factoryInstance = $element.injector().get($scope.factoryName);

            // Receive data from factory that is specified with html
            factoryInstance.getQuestions()
                .success(function(data){
                    $scope.questions = data.questionset;
                    $('#carousel-example-generic'+ $scope.uniqueId +'').carousel({
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

                $scope.answerObj = {
                    "question number" : $scope.count + 1,
                    "answer" : $index + 1
                }

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
                $scope.resultArray.push($scope.answerObj);
            };

            $scope.setFeedback = function() {

                var endPoints = $scope.feedbackArray;
                $scope.total = 0;
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

            $scope.sendResults = function() {                

                $scope.userObj = {
                    "userdetails" : {
                        "name" : $scope.user.name,
                        "email" : $scope.user.email,
                        "phone": $scope.user.phone
                    },
                    "answers" : {
                        "items" : $scope.resultArray 
                    }
                }

                resultsRef.push($scope.userObj);

            };

            $scope.restartQuiz = function() {

                $('#carousel-example-generic'+ $scope.uniqueId +'').carousel(0);
                $('#carousel-example-generic'+ $scope.uniqueId +'').on('slid.bs.carousel', function(){
                    $scope.feedback = null;
                });
                $scope.count = 0;
                $scope.total = 0;
                $scope.feedbackArray = [];
                $scope.user.name = "";
                $scope.user.email = "";
                $scope.user.phone = "";
                $scope.resultArray = [];
                $scope.userObj = {};

            };
        }
    }
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