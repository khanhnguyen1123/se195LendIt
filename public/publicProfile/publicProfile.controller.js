(function() {
  
  angular
    .module('meanApp')
    .controller('publicProfileController', publicProfileController);
  publicProfileController.$inject = ['$scope','$http','$stateParams', 'authentication', 'meanData'];

  function publicProfileController($scope,$http,$stateParams, authentication, meanData) {
    $scope.userFound = false;
    $scope.user;
    $scope.currentUser;
    $scope.review = {};
    $scope.message = {};
    $scope.owner = false;
    //Send Message, Write a Review, View Reviews
    $scope.buttons = [false, false, false];
    $scope.loggedIn = authentication.isLoggedIn();
    $scope.viewReviews = false;
    $scope.alert = {
      'class' : '',
      'message' : '',
      'show' : false,
    };

    let id = $stateParams.random;
    $http.get('/api/profile/get/'+id)
      .success(function(data){    
        $scope.user = data;
      })
      .error(function(error) {
        console.log('Error: ' + error);
      })
      .then (function () {
        if ($scope.user != "") {
          $scope.userFound = true;
          checkUser();
        }
      });

    function checkUser() {
      if (authentication.isLoggedIn()) {
        meanData.getProfile()
          .success(function(data) {
            $scope.currentUser = data;
          })
          .error(function (e) {
            console.log(e);
          })
          .then (function () {
            if ($scope.user._id != $scope.currentUser._id) {
              $scope.buttons[0] = true;
              $scope.buttons[1] = true;
            }
            checkReviews();
          });
      }
    }
    function checkReviews() {
      if ($scope.user.reviews.length > 0) {
        for (let i=0; i < $scope.user.reviews.length; i++) {
          if ($scope.user.reviews[i].user == $scope.currentUser._id) {
            $scope.buttons[1] = false;
            return;
          }
        }
      }
    }

    $scope.sendMessage = function () {
      //To Be Fixed to Conversational
      $scope.message.user = $scope.currentUser._id;
      $scope.message.username = $scope.currentUser.name;
      $scope.message.userImg = $scope.currentUser.profileImage.url;
      $scope.message.date = new Date();
      $http.put('/api/profile/message/'+id, $scope.message)
        .success(function(data){    
          $scope.user.messages.push($scope.message);
          $scope.message = {};
          $scope.alert = {
            'class' : 'alert-success',
            'message' : 'Message Sent Successfully',
            'show' : true,
          };
        })
        .error(function(error) {
          $scope.alert = {
            'class' : 'alert-danger',
            'message' : 'Message Failed To Send',
            'show' : true,
          };
          console.log(error);
        });
    }

    $scope.sendReview = function () {
      $scope.review.user = $scope.currentUser._id;
      $scope.review.username = $scope.currentUser.name;
      $scope.review.date = new Date();
      $http.put('/api/profile/review/'+id, $scope.review)
        .success(function(data){    
          $scope.user.reviews.push($scope.review);
          $scope.review = {};
          $scope.alert = {
            'class' : 'alert-success',
            'message' : 'Review Submission Successfully',
            'show' : true,
          };
          $scope.buttons[1] = false;
        })
        .error(function(error) {
          $scope.alert = {
            'class' : 'alert-danger',
            'message' : 'Review Submission Failed',
            'show' : true,
          };
          console.log(error);
        });
    }

  }
})();