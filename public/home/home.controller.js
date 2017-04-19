(function() { 
   angular
      .module('meanApp')
      .controller('homeCtrl', homeCtrl);
   homeCtrl.$inject = ['$scope', '$location', 'authentication', 'meanData', '$http'];

   function homeCtrl ($scope, $location, authentication, meanData, $http) {
      //console.log('Home Controller is Running');

      //TBD
      //Fix Home Page, Delete Messages, Fix User Model to View Message Chains, Add Reply
      $scope.user = {};
      $scope.form = {
         email : "",
         password : ""
      };
      $scope.loggedIn = authentication.isLoggedIn();
      $scope.m2 = {};

      let message = 
      {
         "userImg" : "https://cdn.filepicker.io/api/file/d88adUzMQ4yg0FXN5hTp",
         "user" : "User ID",
         "username" : "Name",
         "date" : new Date(),
         "title" : "Message Title",
         "content" : "Content"
      }
      
      //Check Logged In and Hide Sign In Form
      if ($scope.loggedIn) {
         meanData.getProfile()
            .success(function(data) {
               $scope.user = data;
               $scope.user.messages.push(message);
            })
            .error(function (e) {
               console.log(e);
            })
            .finally( function() {
               getMessages();
            })
      }
      //Login In Function
      $scope.signIn = function () {
         authentication
            .login($scope.form)
            .error(function(err) {
               $scope.message = "Invalid information. Please try again.";
               console.log($scope.message);
            })
            .then(function () {
               $location.path('profile');
            });
      };
      function getMessages () {
         $http.get('api/message2/get/'+$scope.user._id)
            .success( function(data) {
               $scope.m2 = data;
               console.log(data);
            })
            .error ( function(error) {
               console.log(error);
            })
            .finally( function() {
               //deleteMessage();
            });
      }
      function deleteMessage () {
         $http.delete('api/message2/delete/'+$scope.m2[$scope.m2.length-1]._id)
            .success( function(data) {
               console.log(data);
            })
            .error ( function(error) {
               console.log(error);
            })
      }
   }

})();