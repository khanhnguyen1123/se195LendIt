(function() {

   angular
      .module('meanApp')
      .controller('publicProfileController', publicProfileController);
   publicProfileController.$inject = ['$scope','$http','$stateParams', 'authentication', 'meanData', '$window'];

   function publicProfileController($scope,$http,$stateParams, authentication, meanData) {
      $scope.userFound = false;
      $scope.user;
      $scope.currentUser;
      $scope.review = {};
      $scope.message = {};
      $scope.owner = false;

      //Send Message Button, Write a Review Button, View Reviews Display Container
      $scope.buttons = [false, false, false];

      let id = $stateParams.random;
      //Angular Alert UI Setup
      $scope.alert = {
         'class' : '',
         'message' : '',
         'show' : false,
      };

      //Gets Public Profile
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

      //Checks if user logged in and updates functions based on that
      function checkUser() {
         if (authentication.isLoggedIn()) {
            meanData.getProfile()
               .success(function(data) {
                  //Sets Current User
                  $scope.currentUser = data;
               })
               .error(function (e) {
                  console.log(e);
               })
               .then (function () {
                  //Updates Send Message Button and Write Review Button
                  if ($scope.user._id != $scope.currentUser._id) {
                     $scope.buttons[0] = true;
                     $scope.buttons[1] = true;
                  }
                  //Checks if user already submitted a review
                  checkReviews();
               });
         }
      }
      //Checks if users already submitted a review
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

      //Sends message to user
      $scope.sendMessage = function () {
         let newMessage = {
            'userId' : $scope.currentUser._id,
            'userName' : $scope.currentUser.name,
            'userImage' : $scope.currentUser.profileImage.url,
            'otherId' : $scope.user._id,
            'otherName' : $scope.user.name,
            'otherImage' : $scope.user.profileImage.url,
            'messages' : [ {
               'class' : 'convUser',
               'content' : $scope.message.content,
               'date' : new Date()
            }]
         }
         
         $http.post('api/message2/new', newMessage)
            .success( function(data) {
               $scope.message = {};
               $scope.alert = {
                  'class' : 'alert-success',
                  'message' : 'Message Sent Successfully',
                  'show' : true,
               };
            })
            .error ( function(error) {
               $scope.alert = {
                  'class' : 'alert-danger',
                  'message' : 'Message Failed To Send',
                  'show' : true,
               };
               console.log(error);
            });
         
         /*
         $http.post('/api/message/send', $scope.message)
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
            */
      }
      
      //Sends Review
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